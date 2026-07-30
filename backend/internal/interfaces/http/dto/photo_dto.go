package dto

type PhotoUploadResponse struct {
	Status  string     `json:"status"`
	Message string     `json:"message"`
	Data    PhotoData  `json:"data"`
}

type PhotoData struct {
	ProviderID string `json:"provider_id"`
	URL        string `json:"url"`
	Provider   string `json:"provider"`
}
