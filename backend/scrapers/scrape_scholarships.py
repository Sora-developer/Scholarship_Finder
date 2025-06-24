from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
from pymongo import MongoClient
from selenium.common.exceptions import TimeoutException
import time

# MongoDB setup
client = MongoClient("mongodb://localhost:27017/")
db = client["scholarshipFinder"]
collection = db["scholarships"]

# Setup Selenium
options = webdriver.ChromeOptions()
options.add_argument('--headless')  # comment out to see browser
options.add_argument('--no-sandbox')
options.add_argument('--disable-dev-shm-usage')

driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

def scrape_buddy4study():
    url = "https://www.buddy4study.com/scholarships"
    driver.get(url)
    try:
        WebDriverWait(driver, 20).until(
            EC.presence_of_all_elements_located((By.CSS_SELECTOR, ".Listing_categoriesCard___CHju"))
        )
    except TimeoutException:
            print("Could not find .search-result-item — printing page source...")
            print(driver.page_source[:1000])  # Print first 1000 chars for inspection
            driver.quit()
            exit()
    

    cards = driver.find_elements(By.CSS_SELECTOR, ".Listing_categoriesBox__CiGvQ")
    print(f"[i] Found {len(cards)} scholarships")

    for card in cards:
        try:
            # Fallback to <h4> tag and first <a> href
            title = card.find_element(By.TAG_NAME, "h4").text.strip()
            link = card.find_element(By.TAG_NAME, "a").get_attribute("href")

            # Select all spans under Listing_rightAward — fallback
            spans = card.find_elements(By.CSS_SELECTOR, "div[class*='Listing_rightAward'] span")
            amount = spans[0].text.strip() if len(spans) > 0 else "Not specified"
            eligibility = spans[1].text.strip() if len(spans) > 1 else "Not specified"
            try:
                deadline = card.find_element(By.CSS_SELECTOR, ".Listing_calendarDate__WCgKV").text.strip()
            except Exception:
                deadline = "See Website"

            data = {
                "name": title,
                "amount": amount,
                "deadline": deadline,
                "link": link,
                "eligibility": eligibility
            }

            collection.update_one({'name': title}, {'$set': data}, upsert=True)
            print(f"[+] Saved: {title}")

        except Exception as e:
            print(f"[!] Error parsing card: {e}")

    print("Scraping complete.")
    driver.quit()

if __name__ == "__main__":
    scrape_buddy4study()
