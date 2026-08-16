# Zeera Laundry: Web Information System

Zeera Laundry is a comprehensive web-based management platform built to simplify daily laundry operations and elevate customer service. It equips business owners with a centralized operational dashboard, a seamless point of sale (POS) system, and provides customers with a convenient, login-free portal to track their orders in real-time.

## Application Previews

### Admin Panel (Desktop View)

| 1. Operational Dashboard | 2. Point of Sale (POS) |
| :---: | :---: |
| <img width="1919" height="907" alt="Screenshot 2026-08-17 014754" src="https://github.com/user-attachments/assets/f328dfae-8cbf-4281-9603-d558e8cf3af3" /> | <img width="1919" height="908" alt="Screenshot 2026-08-17 014843" src="https://github.com/user-attachments/assets/35080477-7593-4afa-8064-a2e7a5b4acb6" /> |
| **3. Order Tracking (Admin)** | **4. Financial Analytics** |
| <img width="1919" height="909" alt="Screenshot 2026-08-17 014859" src="https://github.com/user-attachments/assets/7ac81232-6aa0-4639-97f4-bddc0a44836f" /> | <img width="1919" height="907" alt="Screenshot 2026-08-17 014938" src="https://github.com/user-attachments/assets/f46095c0-315b-497e-8d8b-95b28a1251c4" /> |

### Customer Portal (Mobile View)

**5. Real-time Order Tracking**  
*(Optimized for customers scanning receipt QR codes via smartphone)*  
<br>
<img width="512" height="910" alt="Screenshot 2026-08-17 020651" src="https://github.com/user-attachments/assets/a07ce16f-9f17-4b7a-916d-50ee15f98198" />

## Key Features

* **Point of Sale (POS):** Intuitive order creation interface with automated calculation for different service types, specific weights, and estimated completion times.
* **Comprehensive Order Tracking:** Dedicated interfaces for both admins to manage the operational pipeline and customers to track their laundry status in real-time.
* **Financial Analytics:** Automatically aggregates daily income, net profit, and operational expenses into an easy-to-read executive dashboard.
* **Master Data Management:** Efficiently manage the customer database, service packages, and employee access roles.

## Technology Stack

* **Frontend:** HTML, CSS, JavaScript (Tailwind CSS)
* **Backend:** Python
* **Database:** PostgreSQL

## Getting Started

### Prerequisites

* Python (3.9 or higher)
* PostgreSQL database server

### Installation

1. Clone the repository to your local machine.
2. Setup the virtual environment and install dependencies:
```bash
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`
pip install -r requirements.txt
```
3. Configure your database credentials in the environment configuration file.
4. Run the database migrations to build the schema.
5. Start the development server:
```bash
python main.py
```
