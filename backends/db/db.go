package db

import (
	"fmt"
	"log"
	"os"
	"shorter/model"
	"time"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var newLogger = logger.New(
	log.New(os.Stdout, "\r\n", log.LstdFlags),
	logger.Config{
		SlowThreshold:             time.Second,
		LogLevel:                  logger.Error,
		IgnoreRecordNotFoundError: true,
		ParameterizedQueries:      true,
		Colorful:                  false,
	},
)

func New() *gorm.DB {

	db, err := gorm.Open(sqlite.Open("shorter.db"), &gorm.Config{
		Logger: newLogger,
	})

	if err != nil {
		fmt.Println("storage err: ", err)
	}
	// https://gorm.io/zh_CN/docs/generic_interface.html
	// sqlDB, err := db.DB()
	// sqlDB.SetMaxIdleConns(10)
	return db
}

func TestDB() *gorm.DB {
	db, err := gorm.Open(sqlite.Open("shorter_test.db"), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Silent),
	})
	if err != nil {
		fmt.Println("storage err: ", err)
	}
	return db
}

func DropTestDB() error {
	if err := os.Remove("./../shorter_test.db"); err != nil {
		return err
	}
	return nil
}

func AutoMigrate(db *gorm.DB) {
	db.AutoMigrate(
		&model.User{},
		&model.Site{},
		&model.Url{},
	)
}
