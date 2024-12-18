# MongoDB Intermediate

## Getting Started

Follow the steps below to set up, back up, and restore the necessary collections for this project.

### Clone the Repository

To get started, clone the project repository to your local machine:

```bash
git clone https://github.com/Peroxidize/mongodb-intermediate
```

### Execute the Script

Assuming you have MongoDB installed on your machine, you can simply run this command to initialize the database and collections as defined in the `db.js` file:

```bash
mongosh < db.js
```

### Backup the Database

To create a backup of the database named `intermediate`, you can use either of the following methods:

1. **Using the `mongodump` Command**:
   ```bash
   mongodump --db intermediate --out ./backup
   ```

2. **Using the Bash Script**:
   Run the `backup.sh` script included in this repository:
   ```bash
   ./backup.sh
   ```

### Restore the Database

To restore the database from a backup, you can use one of the following methods:

1. **Using the `mongorestore` Command**:
   ```bash
   mongorestore --db intermediate ./backup/intermediate
   ```

2. **Using the Bash Script**:
   Run the `restore-backup.sh` script included in this repository:
   ```bash
   ./restore-backup.sh
   ```

## Additional Information

Ensure that MongoDB is installed and running on your system before executing these commands. You can check the MongoDB documentation for installation instructions if needed:

- [MongoDB Installation Guide](https://www.mongodb.com/docs/manual/installation/)

### Notes

- The `db.js` file contains the necessary commands to set up the `users`, `products`, and `orders` collections along with sample data.
- Make sure the `backup` directory has the necessary write permissions when creating backups.
- If restoring, ensure the `backup` directory contains the appropriate dump files.
