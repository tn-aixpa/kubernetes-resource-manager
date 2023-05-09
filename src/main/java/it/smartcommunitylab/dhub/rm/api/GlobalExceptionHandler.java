package it.smartcommunitylab.dhub.rm.api;

import io.fabric8.kubernetes.client.KubernetesClientException;
import it.smartcommunitylab.dhub.rm.exception.ValidationException;
import jakarta.validation.ConstraintViolationException;
import java.util.NoSuchElementException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

@ControllerAdvice
public class GlobalExceptionHandler {

    Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ResponseBody
    @ExceptionHandler(NoSuchElementException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    String noSuchElementHandler(NoSuchElementException ex) {
        return ex.getMessage();
    }

    @ResponseBody
    @ExceptionHandler(IllegalArgumentException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    String illegalArgumentHandler(IllegalArgumentException ex) {
        return ex.getMessage();
    }

    @ResponseBody
    @ExceptionHandler(DataIntegrityViolationException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    String dataIntegrityViolationHandler(DataIntegrityViolationException ex) {
        return ex.getMessage();
    }

    @ResponseBody
    @ExceptionHandler(AccessDeniedException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    String accessDeniedHandler(AccessDeniedException ex) {
        return ex.getMessage();
    }

    @ResponseBody
    @ExceptionHandler(KubernetesClientException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    String kubernetesClientHandler(KubernetesClientException ex) {
        logger.info("Exception code: {}", ex.getCode());
        logger.info("Exception message: {}", ex.getMessage());
        logger.info("Exception status message: {}", ex.getStatus().getMessage());
        return ex.getStatus().getMessage();
    }

    @ResponseBody
    @ExceptionHandler(ValidationException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    String validationHandler(ValidationException ex) {
        return ex.getMessage();
    }

    @ResponseBody
    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    String methodArgumentNotValidHandler(MethodArgumentNotValidException ex) {
        return ex.getAllErrors().toString();
    }

    @ResponseBody
    @ExceptionHandler(ConstraintViolationException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    String constraintViolationHandler(ConstraintViolationException ex) {
        return ex.getMessage();
    }
}
