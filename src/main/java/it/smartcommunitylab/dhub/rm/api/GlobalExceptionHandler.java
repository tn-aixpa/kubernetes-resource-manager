package it.smartcommunitylab.dhub.rm.api;

import java.util.NoSuchElementException;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import io.fabric8.kubernetes.client.KubernetesClientException;
import it.smartcommunitylab.dhub.rm.exception.ValidationException;
import jakarta.validation.ConstraintViolationException;

@ControllerAdvice
public class GlobalExceptionHandler {
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
        System.out.println("Exception code: " + ex.getCode());
        System.out.println("Exception message: " + ex.getMessage());
        System.out.println("Exception status message: " + ex.getStatus().getMessage());
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
