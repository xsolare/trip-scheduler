use clap::{Parser, Subcommand};
use trip_scheduler_lib::{mock};
use std::process::Command;

#[derive(Parser)]
#[command(author, version, about, long_about = None)]
struct Cli {
  #[command(subcommand)]
  command: Commands,
}

#[derive(Subcommand)]
enum Commands {
  Seed,
  Reset,
}
    
#[tokio::main]
async fn main() {
    let cli = Cli::parse();

    match &cli.command {
        Commands::Seed => {
            if let Err(e) = seed_data().await {
                eprintln!("Error seeding data: {}", e);
            } else {
                println!("Database seeded successfully!");
            }
        }
        Commands::Reset => {
            if let Err(e) = reset_db().await {
                eprintln!("Error resetting database: {}", e);
            } else {
                println!("Database reset successfully!");
            }
        }
    }
}

async fn reset_db() -> Result<(), Box<dyn std::error::Error>> {
    let db_path_str = "/home/evai/.config/com.trip-scheduler.app/trip-scheduler.db";
    let db_path = std::path::Path::new(db_path_str);

    if db_path.exists() {
        println!("Removing database file: {}", db_path_str);
        std::fs::remove_file(&db_path)?;
    } else {
        println!("Database file not found, nothing to do.");
    }
    
    Ok(())
}

async fn seed_data() -> Result<(), Box<dyn std::error::Error>> {
    // Create database file and run migrations using sqlite3 command line tool
    let db_path = "/home/evai/.config/com.trip-scheduler.app/trip-scheduler.db";
    
    // Create the database with schema
    let migrations = trip_scheduler_lib::get_migrations();
    for migration in migrations {
        let output = Command::new("sqlite3")
            .arg(db_path)
            .arg(&migration.sql)
            .output()?;
            
        if !output.status.success() {
            return Err(format!("Failed to run migration: {}", String::from_utf8_lossy(&output.stderr)).into());
        }
    }

    let plans = mock::get_mock_plans();

    for trip in plans {
        let cities_json = serde_json::to_string(&trip.cities.unwrap_or_default())?;
        let participants_json = serde_json::to_string(&trip.participants.unwrap_or_default())?;
        let tags_json = serde_json::to_string(&trip.tags.unwrap_or_default())?;

        let sql = format!(
            "INSERT INTO trips (id, title, description, image_url, start_date, end_date, days, cities, status, budget, currency, participants, tags, visibility) VALUES ('{}', '{}', '{}', '{}', '{}', '{}', {}, '{}', '{}', {}, '{}', '{}', '{}', '{}');",
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

        let output = Command::new("sqlite3")
            .arg(db_path)
            .arg(&sql)
            .output()?;
            
        if !output.status.success() {
            return Err(format!("Failed to insert data: {}", String::from_utf8_lossy(&output.stderr)).into());
        }
    }

    Ok(())
}
