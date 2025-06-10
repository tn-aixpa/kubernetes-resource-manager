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

@ControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    Logger exceptionsLogger = LoggerFactory.getLogger(GlobalExceptionHandler.class);
    private static final DateTimeFormatter formatter = DateTimeFormatter
        .ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSS+00:00")
        .withZone(ZoneOffset.UTC);

    /**
     * Builds a ResponseEntity with a detailed body.
     *
     * @param ex      Exception.
     * @param status  HTTP status.
     * @param request Web request.
     * @return ResponseEntity with a detailed body.
     */
    private ResponseEntity<Object> buildResponse(Exception ex, HttpStatus status, WebRequest request, String message) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", formatter.format(Instant.now()));
        body.put("status", status.value());
        body.put("error", status.getReasonPhrase());
        body.put("message", message);

        if (request instanceof ServletWebRequest) body.put(
            "path",
            ((ServletWebRequest) request).getRequest().getRequestURI()
        );

        return handleExceptionInternal(ex, body, new HttpHeaders(), status, request);
    }

    private ResponseEntity<Object> buildResponse(Exception ex, HttpStatus status, WebRequest request) {
        return buildResponse(ex, status, request, ex.getMessage());
    }

    @ExceptionHandler(NoSuchElementException.class)
    ResponseEntity<Object> noSuchElementHandler(NoSuchElementException ex, WebRequest request) {
        return buildResponse(ex, HttpStatus.NOT_FOUND, request);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    ResponseEntity<Object> illegalArgumentHandler(IllegalArgumentException ex, WebRequest request) {
        return buildResponse(ex, HttpStatus.BAD_REQUEST, request);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    ResponseEntity<Object> dataIntegrityViolationHandler(DataIntegrityViolationException ex, WebRequest request) {
        return buildResponse(ex, HttpStatus.BAD_REQUEST, request);
    }

    @ExceptionHandler(AccessDeniedException.class)
    ResponseEntity<Object> accessDeniedHandler(AccessDeniedException ex, WebRequest request) {
        return buildResponse(ex, HttpStatus.FORBIDDEN, request);
    }

    @ExceptionHandler(KubernetesClientException.class)
    ResponseEntity<Object> kubernetesClientHandler(KubernetesClientException ex, WebRequest request) {
        exceptionsLogger.info("Exception code: {}", ex.getCode());
        exceptionsLogger.info("Exception message: {}", ex.getMessage());
        exceptionsLogger.info("Exception status message: {}", ex.getStatus().getMessage());
        return buildResponse(ex, HttpStatus.BAD_REQUEST, request, ex.getStatus().getMessage());
    }

    @ExceptionHandler(ValidationException.class)
    ResponseEntity<Object> validationHandler(ValidationException ex, WebRequest request) {
        return buildResponse(ex, HttpStatus.BAD_REQUEST, request);
    }

    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(
        MethodArgumentNotValidException ex,
        HttpHeaders headers,
        HttpStatusCode status,
        WebRequest request
    ) {
        return buildResponse(ex, HttpStatus.BAD_REQUEST, request, ex.getAllErrors().toString());
    }

    @ExceptionHandler(ConstraintViolationException.class)
    ResponseEntity<Object> constraintViolationHandler(ConstraintViolationException ex, WebRequest request) {
        return buildResponse(ex, HttpStatus.BAD_REQUEST, request);
    }
}
