variable "environment" {
  type = string
}

variable "image" {
  type = string
}

resource "terraform_data" "record" {
  input = {
    environment = var.environment
    image       = var.image
  }
}

output "release_record" {
  value = terraform_data.record.output
}