package middleware

import (
	"net/http"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
)

type RateLimiter struct {
	requests map[string][]time.Time
	mu       sync.RWMutex
	limit    int
	window   time.Duration
}

var (
	rateLimiter = &RateLimiter{
		requests: make(map[string][]time.Time),
		limit:    30,  // 30 requests per minute
		window:   time.Minute,
	}
)

func (rl *RateLimiter) cleanup() {
	rl.mu.Lock()
	defer rl.mu.Unlock()

	now := time.Now()
	for ip, times := range rl.requests {
		var valid []time.Time
		for _, t := range times {
			if now.Sub(t) < rl.window {
				valid = append(valid, t)
			}
		}
		if len(valid) == 0 {
			delete(rl.requests, ip)
		} else {
			rl.requests[ip] = valid
		}
	}
}

func RateLimit() func(c *gin.Context) {
	// Start cleanup goroutine
	go func() {
		for {
			time.Sleep(time.Minute)
			rateLimiter.cleanup()
		}
	}()

	return func(c *gin.Context) {
		ip := c.ClientIP()

		rateLimiter.mu.Lock()
		times := rateLimiter.requests[ip]
		now := time.Now()

		// Filter out old requests
		var valid []time.Time
		for _, t := range times {
			if now.Sub(t) < rateLimiter.window {
				valid = append(valid, t)
			}
		}

		// Check if limit exceeded
		if len(valid) >= rateLimiter.limit {
			rateLimiter.mu.Unlock()
			c.JSON(http.StatusTooManyRequests, gin.H{
				"error": "Rate limit exceeded",
				"retry_after": rateLimiter.window.Seconds(),
			})
			c.Abort()
			return
		}

		// Add current request
		valid = append(valid, now)
		rateLimiter.requests[ip] = valid
		rateLimiter.mu.Unlock()

		c.Next()
	}
}
