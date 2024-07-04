package model

import (
	"gorm.io/gorm"
)

type Urls struct {
	gorm.Model
	OriginUrl    string `gorm:"not null"`
	Shorter      string `gorm:"unique_index;not null"`
	Md5          string `gorm:"unique_index;not null"`
	DeleteSign   bool   `gorm:"index;not null;defualt:false"`
	HealthyCheck bool   `gorm:"index;not null;default:false"`
}
