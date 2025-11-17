package main

import (
	"flag"
	"fmt"
	"github.com/gorilla/mux"
	log "github.com/sirupsen/logrus"
	"net/http"
	"strconv"
	"sync"
)

// generally we wouldn't use a global variable, but
// we're doing it here for simplicity
var bitcoins = 0
var bitcoinsMutex = &sync.Mutex{}

func main() {
	port := flag.Int("port", 8080, "http port to run on.")

	router := mux.NewRouter()

	// health check endpoint
	router.HandleFunc("/healthz", func(w http.ResponseWriter, r *http.Request) {
		log.WithField("user_agent", r.UserAgent()).Info("answering health check")
		_, _ = w.Write([]byte("OK"))
	}).Methods(http.MethodGet)

	// endpoint to retrieve the current number of bitcoins
	router.HandleFunc("/v1/bitcoins", GetBitcoins).Methods(http.MethodGet)
	// endpoint to update the current number of bitcoins
	router.HandleFunc("/v1/bitcoins", SetBitcoins).Methods(http.MethodPost)

	// start the http server
	addr := fmt.Sprintf(":%d", *port)
	log.Infof("starting on interface %s", addr)
	log.Fatal(http.ListenAndServe(addr, router))
}

func GetBitcoins(w http.ResponseWriter, _ *http.Request) {
	_, _ = w.Write([]byte(strconv.Itoa(bitcoins)))
}

func SetBitcoins(w http.ResponseWriter, r *http.Request) {
	bitcoinStr := r.URL.Query().Get("bitcoins")
	// try to parse the ?bitcoins= parameter into
	// an integer.
	num, err := strconv.Atoi(bitcoinStr)
	if err != nil {
		log.WithError(err).Error("failed to parse 'bitcoins' query parameter")
		http.Error(w, fmt.Sprintf("could not parse bitcoins submission: %s", err.Error()), http.StatusBadRequest)
		return
	}
	// make sure to lock, so we don't
	// get any weird concurrent behaviour
	log.Infof("banking %d bitcoins", num)
	bitcoinsMutex.Lock()
	bitcoins = bitcoins + num
	bitcoinsMutex.Unlock()
	log.Infof("total bitcoins: %d", bitcoins)

	// return a 204
	w.WriteHeader(http.StatusNoContent)
}
