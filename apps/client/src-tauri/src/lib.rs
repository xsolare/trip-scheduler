use serde::{Deserialize, Serialize};

// Declare the mock module
pub mod mock;

// Define the ITrip struct that's being used
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ITrip {
    pub id: String,
    pub title: String,
    pub description: Option<String>,
    pub image_url: Option<String>,
    pub start_date: Option<String>,
    pub end_date: Option<String>,
    pub days: Option<i32>,
    pub cities: Option<Vec<String>>,
    pub status: Option<String>,
    pub budget: Option<f64>,
    pub currency: Option<String>,
    pub participants: Option<Vec<String>>,
    pub tags: Option<Vec<String>>,
    pub visibility: Option<String>,
}

// Define a struct for migrations
pub struct Migration {
    pub sql: String,
}

// Add the get_migrations function
pub fn get_migrations() -> Vec<Migration> {
    vec![
        Migration {
            sql: "CREATE TABLE IF NOT EXISTS trips (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                description TEXT,
                image_url TEXT,
                start_date TEXT,
                end_date TEXT,
                days INTEGER,
                cities TEXT,
                status TEXT,
                budget REAL,
                currency TEXT,
                participants TEXT,
                tags TEXT,
                visibility TEXT
            );".to_string(),
        }
    ]
}

#[tauri::command]
async fn seed_mock_data(_app_handle: tauri::AppHandle) -> Result<(), String> {
    use std::process::Command;
    
    let plans = mock::get_mock_plans();
    let db_path = "/home/evai/.config/com.trip-scheduler.app/trip-scheduler.db";
 
    let create_table_sql = "CREATE TABLE IF NOT EXISTS trips (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        image_url TEXT,
        start_date TEXT,
        end_date TEXT,
        days INTEGER,
        cities TEXT,
        status TEXT,
        budget REAL,
        currency TEXT,
        participants TEXT,
        tags TEXT,
        visibility TEXT
    );";
 
    Command::new("sqlite3")
        .arg(db_path)
        .arg(create_table_sql)
        .output()
        .map_err(|e| e.to_string())?;
 
    for trip in plans {
        let cities_json = serde_json::to_string(&trip.cities.unwrap_or_default()).map_err(|e| e.to_string())?;
        let participants_json = serde_json::to_string(&trip.participants.unwrap_or_default()).map_err(|e| e.to_string())?;
        let tags_json = serde_json::to_string(&trip.tags.unwrap_or_default()).map_err(|e| e.to_string())?;
 
        let sql = format!(
            "INSERT OR REPLACE INTO trips (id, title, description, image_url, start_date, end_date, days, cities, status, budget, currency, participants, tags, visibility) VALUES ('{}', '{}', '{}', '{}', '{}', '{}', {}, '{}', '{}', {}, '{}', '{}', '{}', '{}');",
            trip.id.replace("'", "''"),
            trip.title.replace("'", "''"),
            trip.description.unwrap_or_default().replace("'", "''"),
            trip.image_url.unwrap_or_default().replace("'", "''"),
            trip.start_date.unwrap_or_default().replace("'", "''"),
            trip.end_date.unwrap_or_default().replace("'", "''"),
            trip.days.unwrap_or_default(),
            cities_json.replace("'", "''"),
            trip.status.unwrap_or_default().replace("'", "''"),
            trip.budget.unwrap_or_default(),
            trip.currency.unwrap_or_default().replace("'", "''"),
            participants_json.replace("'", "''"),
            tags_json.replace("'", "''"),
            trip.visibility.unwrap_or_default().replace("'", "''"),
        );
 
        Command::new("sqlite3")
            .arg(db_path)
            .arg(&sql)
            .output()
            .map_err(|e| e.to_string())?;
    }
 
    Ok(())
}


// Add the run function
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_sql::Builder::default().build())
        .invoke_handler(tauri::generate_handler![seed_mock_data])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
