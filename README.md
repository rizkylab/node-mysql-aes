## Requirements and Recommendations

* Nodejs v18.6.0 (untested other versions)
* NPM 8.13.2
* MariaDB 10.8.3, for Linux (x86_64) 

## What Does This Do?

This encrypts and decrypts columns stored in database tables in NodeJS  applications.
by encrypting data as it is stored in the model attributes and decrypting data as it is recalled from the model attributes.

Note:
Encrypted values are usually longer than plain text values.  Sometimes much longer.  You may find that the column widths in your database tables need to be extended to store the encrypted values. 

## Data APP
![Features](img/app.jpg)
## Data DB
![Features](img/database.jpg)
