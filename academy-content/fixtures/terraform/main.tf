terraform {
  required_version = ">= 1.10, < 2.0"
}

variable "environment" {
  type    = string
  default = "dev"
  validation {
    condition     = contains(["dev", "qa"], var.environment)
    error_message = "Only dev and qa are valid local training environments."
  }
}

module "service" {
  source      = "./modules/service"
  environment = var.environment
  image       = "academy:1"
}

output "release_record" {
  value = module.service.release_record
}