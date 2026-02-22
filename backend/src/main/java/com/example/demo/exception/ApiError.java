package com.example.demo.exception;

public class ApiError extends RuntimeException {
  public ApiError(String message) {
    super(message);
  }
}
