package handlers

import (
	"net/http"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
)

var (
	metricsMutex sync.RWMutex
	requests     = make(map[string]int64)
	latencies   = make(map[string][]float64)
	startTime    = time.Now()
)

func MetricsHandler(c *gin.Context) {
	metricsMutex.RLock()
	defer metricsMutex.RUnlock()

	uptime := time.Since(startTime).Round(time.Second)

	c.Header("Content-Type", "text/plain; version=0.0.4")

	output := "# HELP requests_total Total number of requests by endpoint and method\n"
	output += "# TYPE requests_total counter\n"
	for key, count := range requests {
		output += "requests_total{" + key + "} " + int64ToString(count) + "\n"
	}

	output += "\n# HELP request_duration_seconds Request duration in seconds\n"
	output += "# TYPE request_duration_seconds histogram\n"
	output += "# TYPE request_duration_seconds_summary summary\n"

	for endpoint, latList := range latencies {
		if len(latList) > 0 {
			sum := 0.0
			for _, l := range latList {
				sum += l
			}
			avg := sum / float64(len(latList))
			output += "request_duration_seconds_sum{endpoint=\"" + endpoint + "\"} " + floatToString(avg) + "\n"
			output += "request_duration_seconds_count{endpoint=\"" + endpoint + "\"} " + intToString(len(latList)) + "\n"
		}
	}

	output += "\n# HELP uptime_seconds Server uptime in seconds\n"
	output += "# TYPE uptime_seconds gauge\n"
	output += "uptime_seconds " + int64ToString(int64(uptime.Seconds())) + "\n"

	c.String(http.StatusOK, output)
}

func RecordRequest(method, endpoint, status string, latency time.Duration) {
	metricsMutex.Lock()
	defer metricsMutex.Unlock()

	key := "method=\"" + method + "\",endpoint=\"" + endpoint + "\",status=\"" + status + "\""
	requests[key]++

	latKey := endpoint
	latencies[latKey] = append(latencies[latKey], latency.Seconds())
}

func int64ToString(i int64) string {
	if i == 0 {
		return "0"
	}
	var result string
	negative := i < 0
	if negative {
		i = -i
	}
	for i > 0 {
		result = string(rune(i%10+'0')) + result
		i /= 10
	}
	if negative {
		result = "-" + result
	}
	return result
}

func intToString(i int) string {
	if i == 0 {
		return "0"
	}
	var result string
	for i > 0 {
		result = string(rune(i%10+'0')) + result
		i /= 10
	}
	return result
}

func floatToString(f float64) string {
	return intToString(int(f))
}
