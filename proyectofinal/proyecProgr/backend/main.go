package main

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	_ "github.com/lib/pq"
)

// ---- MODELOS ----
type Habito struct {
	ID             int    `json:"id"`
	Nombre         string `json:"nombre"`
	Descripcion    string `json:"descripcion"`
	MetaFrecuencia string `json:"meta_frecuencia"`
}

type Registro struct {
	ID                int    `json:"id"`
	Fecha             string `json:"fecha"`
	Completado        bool   `json:"completado"`
	Notas             string `json:"notas"`
	HabitoID          int    `json:"habito_id"`
	HabitoNombre      string `json:"habito_nombre,omitempty"`
	HabitoDescripcion string `json:"habito_descripcion,omitempty"`
	HabitoMeta        string `json:"habito_meta,omitempty"`
}

// ---- MAIN ----
func main() {
	db, err := sql.Open("postgres", os.Getenv("DATABASE_URL"))
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	// Crear tablas si no existen
	_, err = db.Exec(`
		CREATE TABLE IF NOT EXISTS habitos (
			id SERIAL PRIMARY KEY,
			nombre TEXT NOT NULL,
			descripcion TEXT NOT NULL,
			meta_frecuencia TEXT
		);

		CREATE TABLE IF NOT EXISTS registros (
			id SERIAL PRIMARY KEY,
			fecha DATE NOT NULL,
			completado BOOLEAN DEFAULT false,
			notas TEXT,
			habito_id INT REFERENCES habitos(id)
		);
	`)
	if err != nil {
		log.Fatal(err)
	}

	router := mux.NewRouter()

	// ---- RUTAS ----
	// HÁBITOS
	router.HandleFunc("/api/habitos", getHabitos(db)).Methods("GET")
	router.HandleFunc("/api/habitos", createHabito(db)).Methods("POST")
	router.HandleFunc("/api/habitos/{id}", updateHabito(db)).Methods("PUT")
	router.HandleFunc("/api/habitos/{id}", deleteHabito(db)).Methods("DELETE")

	// REGISTROS
	router.HandleFunc("/api/registros", getRegistros(db)).Methods("GET")
	router.HandleFunc("/api/registros", createRegistro(db)).Methods("POST")
	router.HandleFunc("/api/registros/{id}", updateRegistro(db)).Methods("PUT")
	router.HandleFunc("/api/registros/{id}", deleteRegistro(db)).Methods("DELETE")

	handler := enableCORS(jsonContentTypeMiddleware(router))

	log.Println("🚀 Servidor corriendo en http://localhost:8000")
	log.Fatal(http.ListenAndServe(":8000", handler))
}

// ---- MIDDLEWARES ----
func enableCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}
		next.ServeHTTP(w, r)
	})
}

func jsonContentTypeMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		next.ServeHTTP(w, r)
	})
}

// ---- HANDLERS ----
// ========== HÁBITOS ==========

// GET /api/habitos
func getHabitos(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		rows, err := db.Query("SELECT id, nombre, descripcion, meta_frecuencia FROM habitos ORDER BY id DESC")
		if err != nil {
			http.Error(w, err.Error(), 500)
			return
		}
		defer rows.Close()

		var habitos []Habito
		for rows.Next() {
			var h Habito
			if err := rows.Scan(&h.ID, &h.Nombre, &h.Descripcion, &h.MetaFrecuencia); err != nil {
				http.Error(w, err.Error(), 500)
				return
			}
			habitos = append(habitos, h)
		}
		json.NewEncoder(w).Encode(habitos)
	}
}

// POST /api/habitos
func createHabito(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var h Habito
		if err := json.NewDecoder(r.Body).Decode(&h); err != nil {
			http.Error(w, err.Error(), 400)
			return
		}

		if h.Nombre == "" || h.Descripcion == "" {
			http.Error(w, "nombre y descripcion son requeridos", 400)
			return
		}

		err := db.QueryRow(
			`INSERT INTO habitos (nombre, descripcion, meta_frecuencia)
			 VALUES ($1, $2, $3) RETURNING id`,
			h.Nombre, h.Descripcion, h.MetaFrecuencia,
		).Scan(&h.ID)
		if err != nil {
			http.Error(w, err.Error(), 500)
			return
		}

		json.NewEncoder(w).Encode(h)
	}
}

// PUT /api/habitos/{id}
func updateHabito(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		id := mux.Vars(r)["id"]
		var h Habito
		if err := json.NewDecoder(r.Body).Decode(&h); err != nil {
			http.Error(w, err.Error(), 400)
			return
		}

		_, err := db.Exec(
			`UPDATE habitos SET nombre=$1, descripcion=$2, meta_frecuencia=$3 WHERE id=$4`,
			h.Nombre, h.Descripcion, h.MetaFrecuencia, id,
		)
		if err != nil {
			http.Error(w, err.Error(), 500)
			return
		}
		w.WriteHeader(http.StatusOK)
	}
}

// DELETE /api/habitos/{id}
func deleteHabito(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		id := mux.Vars(r)["id"]
		result, err := db.Exec("DELETE FROM habitos WHERE id=$1", id)
		if err != nil {
			http.Error(w, "Error al eliminar hábito: "+err.Error(), 500)
			return
		}
		rows, _ := result.RowsAffected()
		if rows == 0 {
			http.Error(w, "Hábito no encontrado", 404)
			return
		}
		w.WriteHeader(http.StatusNoContent)
	}
}

// ========== REGISTROS ==========

// GET /api/registros
func getRegistros(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		rows, err := db.Query(`
			SELECT 
				r.id AS id, r.fecha AS fecha, r.completado AS completado, r.notas AS notas, r.habito_id AS habito_id,
				COALESCE(h.nombre, '') AS habito_nombre,
				COALESCE(h.descripcion, '') AS habito_descripcion,
				COALESCE(h.meta_frecuencia, '') AS habito_meta
			FROM registros r
			LEFT JOIN habitos h ON r.habito_id = h.id
			ORDER BY r.id DESC
		`)
		if err != nil {
			http.Error(w, err.Error(), 500)
			return
		}
		defer rows.Close()

		var registros []Registro
		for rows.Next() {
			var reg Registro
			if err := rows.Scan(
				&reg.ID, &reg.Fecha, &reg.Completado, &reg.Notas,
				&reg.HabitoID, &reg.HabitoNombre, &reg.HabitoDescripcion, &reg.HabitoMeta,
			); err != nil {
				http.Error(w, err.Error(), 500)
				return
			}
			registros = append(registros, reg)
		}

		json.NewEncoder(w).Encode(registros)
	}
}

// POST /api/registros
func createRegistro(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var reg Registro
		if err := json.NewDecoder(r.Body).Decode(&reg); err != nil {
			http.Error(w, "Error al decodificar JSON: "+err.Error(), 400)
			return
		}

		if reg.HabitoID == 0 || reg.Fecha == "" {
			http.Error(w, "Debe tener habito_id y fecha válidos", 400)
			return
		}

		err := db.QueryRow(
			`INSERT INTO registros (fecha, completado, notas, habito_id)
			 VALUES ($1, $2, $3, $4) RETURNING id`,
			reg.Fecha, reg.Completado, reg.Notas, reg.HabitoID,
		).Scan(&reg.ID)
		if err != nil {
			http.Error(w, "Error al insertar registro: "+err.Error(), 500)
			return
		}

		_ = db.QueryRow(
			`SELECT nombre, descripcion, meta_frecuencia FROM habitos WHERE id=$1`,
			reg.HabitoID,
		).Scan(&reg.HabitoNombre, &reg.HabitoDescripcion, &reg.HabitoMeta)

		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(reg)
	}
}

// PUT /api/registros/{id}
func updateRegistro(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		id := mux.Vars(r)["id"]
		var reg Registro
		if err := json.NewDecoder(r.Body).Decode(&reg); err != nil {
			http.Error(w, err.Error(), 400)
			return
		}

		_, err := db.Exec(
			`UPDATE registros SET fecha=$1, completado=$2, notas=$3, habito_id=$4 WHERE id=$5`,
			reg.Fecha, reg.Completado, reg.Notas, reg.HabitoID, id,
		)
		if err != nil {
			http.Error(w, err.Error(), 500)
			return
		}
		w.WriteHeader(http.StatusOK)
	}
}

// DELETE /api/registros/{id}
func deleteRegistro(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		id := mux.Vars(r)["id"]
		result, err := db.Exec("DELETE FROM registros WHERE id=$1", id)
		if err != nil {
			http.Error(w, "Error al eliminar registro: "+err.Error(), 500)
			return
		}
		rows, _ := result.RowsAffected()
		if rows == 0 {
			http.Error(w, "Registro no encontrado", 404)
			return
		}
		w.WriteHeader(http.StatusNoContent)
	}
}
