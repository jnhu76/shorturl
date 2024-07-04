package model

import (
	"gorm.io/gorm"
)

type Url struct {
	gorm.Model
	OriginUrl    string `gorm:"not null"`
	Shorter      string `gorm:"unique_index;not null"`
	Md5          string `gorm:"unique_index;not null"`
	DeleteSign   bool   `gorm:"index;not null;defualt:false"`
	HealthyCheck bool   `gorm:"index;not null;default:false"`
	Site         Site
	User         User
}

type Site struct {
	gorm.Model
	Site  string `gorm:"unique_index;not null"`
	Valid bool   `gorm:"not null;default:true"`
}

func (u *Url) GetUrl() string {
	return ""
}
