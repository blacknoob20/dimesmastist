package domain

import "errors"

var (
	ErrNotFound      = errors.New("resource not found")
	ErrValidation    = errors.New("validation failed")
	ErrConflict      = errors.New("resource conflict")
	ErrInternal      = errors.New("internal server error")
	ErrNotImplemented = errors.New("not implemented")
)
