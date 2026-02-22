package com.example.demo.exception;

public class GlobalExceptionHandler extends RuntimeException {
  public GlobalExceptionHandler(String message) {
    super(message);
  }
}
