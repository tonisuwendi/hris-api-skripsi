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

CREATE TABLE office_locations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  latitude DECIMAL(10,8) NOT NULL,
  longitude DECIMAL(11,8) NOT NULL,
  radius_meters INT DEFAULT 100,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE attendance_sessions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id INT NOT NULL,
  work_date DATE NOT NULL,
  start_time DATETIME NOT NULL,
  end_time DATETIME,
  work_mode ENUM('onsite','remote') NOT NULL,
  office_id INT NULL,
  office_name VARCHAR(100),
  ci_latitude DECIMAL(10,8) NOT NULL,
  ci_longitude DECIMAL(11,8) NOT NULL,
  co_latitude DECIMAL(10,8),
  co_longitude DECIMAL(11,8),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
  FOREIGN KEY (office_id) REFERENCES office_locations(id) ON DELETE SET NULL
);
