package config

type Properties struct {
	Port            string `env:"MY_APP_PORT" env-default:"8080"`
	Host            string `env:"HOST" env-default:"localhost"`
	DBHost          string `env:"DB_HOST" env-default:"localhost"`
	DBPort          string `env:"DB_PORT" env-default:"27017"`
	DBName          string `env:"DB_NAME" env-default:"dronegraphy_db"`
	VideoCollection string `env:"VIDEO_COLLECTION_NAME" env-default:"videos"`
	UsersCollection string `env:"USERS_COLLECTION_NAME" env-default:"users"`
	RolesCollection string `env:"ROLES_COLLECTION_NAME" env-default:"roles"`
}
