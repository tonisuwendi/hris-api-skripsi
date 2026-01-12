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
  religion ENUM('islam','kristen','katolik','hindu','buddha','konghucu'),
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
  ci_photo_url VARCHAR(200),
  co_latitude DECIMAL(10,8),
  co_longitude DECIMAL(11,8),
  co_photo_url VARCHAR(200),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
  FOREIGN KEY (office_id) REFERENCES office_locations(id) ON DELETE SET NULL
);

CREATE TABLE task_summaries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id INT NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  completed_tasks INT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES employees(id)
);

CREATE TABLE performance_reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id INT NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  productivity_score TINYINT NOT NULL CHECK (productivity_score BETWEEN 1 AND 10),
  quality_score TINYINT NOT NULL CHECK (quality_score BETWEEN 1 AND 10),
  discipline_score TINYINT NOT NULL CHECK (discipline_score BETWEEN 1 AND 10),
  softskill_score TINYINT NOT NULL CHECK (softskill_score BETWEEN 1 AND 10),
  overall_score DECIMAL(5,2) GENERATED ALWAYS AS (
    (productivity_score + quality_score + discipline_score + softskill_score) / 4
  ) STORED,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

CREATE TABLE attendance_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id INT NOT NULL,
  request_type ENUM('annual_leave', 'sick', 'other') NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  status ENUM('pending', 'approved', 'rejected', 'cancelled') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

INSERT INTO admins (name, email, password) VALUES 
('Admin', 'admin@salariku.com', '$2a$12$z7a3qopUS/PN9YuIzxBlA.rXw.v6.qnDdKcpkgM1YobZqTpUbzatO'); -- default password: admin123
