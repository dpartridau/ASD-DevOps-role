package com.example.demo;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class BitCoinController {
    private final Logger logger = LoggerFactory.getLogger(BitCoinController.class);
    private int bitcoins = 0;

    @GetMapping("/healthz")
    public String healthz() {
        return "OK";
    }

    @GetMapping("/v1/bitcoins")
    public Integer getBitcoins() {
        return bitcoins;
    }

    @PostMapping("/v1/bitcoins")
    public ResponseEntity<String> setBitcoins(@RequestParam("bitcoins") int num) {
        logger.info("banking {} bitcoins", num);
        bitcoins = bitcoins + num;
        logger.info("total bitcoins: {}", bitcoins);
        return ResponseEntity.noContent().build();
    }
}
