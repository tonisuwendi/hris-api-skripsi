CREATE TABLE admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(200) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE positions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE employees (
  id INT AUTO_INCREMENT PRIMARY KEY,
  employee_code VARCHAR(50) UNIQUE,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(200) NOT NULL,
  photo_url VARCHAR(200),
  birth_place VARCHAR(100),
  birth_date DATE,
  gender ENUM('male','female'),
  marital_status ENUM('single','married','divorced','widowed'),
  religion ENUM('islam','kristen','katolik','hindu','budha','konghucu'),
  address TEXT,
  city VARCHAR(100),
  province VARCHAR(100),
  position_id INT,
  salary DECIMAL(12,2),
  date_joined DATE,
  status ENUM('active','inactive') DEFAULT 'active',
  education_level ENUM('SD','SMP','SMA','D1','D2','D3','D4','S1','S2','S3'),
  major VARCHAR(100),
  institution VARCHAR(100),
  graduation_year YEAR,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (position_id) REFERENCES positions(id) ON DELETE SET NULL
);

