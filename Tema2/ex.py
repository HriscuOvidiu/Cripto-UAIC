from selenium import webdriver
driver = webdriver.Chrome('C:\\Users\\Ovidiu\\Downloads\\chromedriver_win32\\chromedriver.exe')

driver.get('https://www.amazon.com/Best-Sellers-Beauty-Foundation-Makeup/zgbs/beauty/11058871?fbclid=IwAR3z4t4_OWmFeCmMx4NCbPOZhUN3K2jDrN4EX7KPknnyKcNWs9z7oJ4q8Bw')
elements = driver.find_elements_by_class_name("p13n-sc-truncated")

print(len(elements))

for el in elements:
    text = el.text.encode('UTF-8')
    print(text)