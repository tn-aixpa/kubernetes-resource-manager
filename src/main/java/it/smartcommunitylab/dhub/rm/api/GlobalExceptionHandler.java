// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

package it.smartcommunitylab.dhub.rm.api;

import io.fabric8.kubernetes.client.KubernetesClientException;
import it.smartcommunitylab.dhub.rm.exception.ValidationException;
import jakarta.validation.ConstraintViolationException;
import java.time.Instant;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.NoSuchElementException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.ServletWebRequest;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

/**
 * Global exception handler for handling various exceptions across the application.
 */
@ControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    Logger exceptionsLogger = LoggerFactory.getLogger(GlobalExceptionHandler.class);
    private static final DateTimeFormatter formatter = DateTimeFormatter
        .ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSS+00:00")
        .withZone(ZoneOffset.UTC);

    /**
     * Builds a ResponseEntity with a detailed body for exceptions.
     *
     * @param ex      Exception to be handled.
     * @param status  HTTP status to be set in the response.
     * @param request Web request associated with the exception.
     * @param message Custom message to be included in the response.
     * @return ResponseEntity with a detailed body.
     */
    private ResponseEntity<Object> buildResponse(Exception ex, HttpStatus status, WebRequest request, String message) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", formatter.format(Instant.now()));
        body.put("status", status.value());
        body.put("error", status.getReasonPhrase());
        body.put("message", message);

        if (request instanceof ServletWebRequest) {
            body.put("path", ((ServletWebRequest) request).getRequest().getRequestURI());
        }

        return handleExceptionInternal(ex, body, new HttpHeaders(), status, request);
    }

    /**
     * Builds a ResponseEntity with the exception message as the body.
     *
     * @param ex      Exception to be handled.
     * @param status  HTTP status to be set in the response.
     * @param request Web request associated with the exception.
     * @return ResponseEntity with the exception message as the body.
     */
    private ResponseEntity<Object> buildResponse(Exception ex, HttpStatus status, WebRequest request) {
        return buildResponse(ex, status, request, ex.getMessage());
    }

    /**
     * Handles NoSuchElementException by returning a 404 Not Found response.
     *
     * @param ex      The NoSuchElementException that was thrown.
     * @param request The current web request.
     * @return ResponseEntity with a 404 status.
     */
    @ExceptionHandler(NoSuchElementException.class)
    ResponseEntity<Object> noSuchElementHandler(NoSuchElementException ex, WebRequest request) {
        return buildResponse(ex, HttpStatus.NOT_FOUND, request);
    }

    /**
     * Handles IllegalArgumentException by returning a 400 Bad Request response.
     *
     * @param ex      The IllegalArgumentException that was thrown.
     * @param request The current web request.
     * @return ResponseEntity with a 400 status.
     */
    @ExceptionHandler(IllegalArgumentException.class)
    ResponseEntity<Object> illegalArgumentHandler(IllegalArgumentException ex, WebRequest request) {
        return buildResponse(ex, HttpStatus.BAD_REQUEST, request);
    }

    /**
     * Handles DataIntegrityViolationException by returning a 400 Bad Request response.
     *
     * @param ex      The DataIntegrityViolationException that was thrown.
     * @param request The current web request.
     * @return ResponseEntity with a 400 status.
     */
    @ExceptionHandler(DataIntegrityViolationException.class)
    ResponseEntity<Object> dataIntegrityViolationHandler(DataIntegrityViolationException ex, WebRequest request) {
        return buildResponse(ex, HttpStatus.BAD_REQUEST, request);
    }

    /**
     * Handles AccessDeniedException by returning a 403 Forbidden response.
     *
     * @param ex      The AccessDeniedException that was thrown.
     * @param request The current web request.
     * @return ResponseEntity with a 403 status.
     */
    @ExceptionHandler(AccessDeniedException.class)
    ResponseEntity<Object> accessDeniedHandler(AccessDeniedException ex, WebRequest request) {
        return buildResponse(ex, HttpStatus.FORBIDDEN, request);
    }

    /**
     * Handles KubernetesClientException by returning a 400 Bad Request response
     * and logging the exception details.
     *
     * @param ex      The KubernetesClientException that was thrown.
     * @param request The current web request.
     * @return ResponseEntity with a 400 status and exception details.
     */
    @ExceptionHandler(KubernetesClientException.class)
    ResponseEntity<Object> kubernetesClientHandler(KubernetesClientException ex, WebRequest request) {
        exceptionsLogger.info("Exception code: {}", ex.getCode());
        exceptionsLogger.info("Exception message: {}", ex.getMessage());
        exceptionsLogger.info("Exception status message: {}", ex.getStatus().getMessage());
        return buildResponse(ex, HttpStatus.BAD_REQUEST, request, ex.getStatus().getMessage());
    }

    /**
     * Handles ValidationException by returning a 400 Bad Request response.
     *
     * @param ex      The ValidationException that was thrown.
     * @param request The current web request.
     * @return ResponseEntity with a 400 status.
     */
    @ExceptionHandler(ValidationException.class)
    ResponseEntity<Object> validationHandler(ValidationException ex, WebRequest request) {
        return buildResponse(ex, HttpStatus.BAD_REQUEST, request);
    }

    /**
     * Overrides the default handling of MethodArgumentNotValidException to return
     * a 400 Bad Request response with error details.
     *
     * @param ex      The MethodArgumentNotValidException that was thrown.
     * @param headers The HTTP headers to be written to the response.
     * @param status  The HTTP status code.
     * @param request The current web request.
     * @return ResponseEntity with a 400 status and error details.
     */
    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(
        MethodArgumentNotValidException ex,
        HttpHeaders headers,
        HttpStatusCode status,
        WebRequest request
    ) {
        return buildResponse(ex, HttpStatus.BAD_REQUEST, request, ex.getAllErrors().toString());
    }

    /**
     * Handles ConstraintViolationException by returning a 400 Bad Request response.
     *
     * @param ex      The ConstraintViolationException that was thrown.
     * @param request The current web request.
     * @return ResponseEntity with a 400 status.
     */
    @ExceptionHandler(ConstraintViolationException.class)
    ResponseEntity<Object> constraintViolationHandler(ConstraintViolationException ex, WebRequest request) {
        return buildResponse(ex, HttpStatus.BAD_REQUEST, request);
    }
}
