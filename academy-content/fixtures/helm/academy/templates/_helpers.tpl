{{- define "academy.name" -}}
{{- printf "%s-academy" .Release.Name | trunc 63 | trimSuffix "-" -}}
{{- end -}}