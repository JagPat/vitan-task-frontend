import asyncio
from playwright import async_api

async def run_test():
    pw = None
    browser = None
    context = None
    
    try:
        # Start a Playwright session in asynchronous mode
        pw = await async_api.async_playwright().start()
        
        # Launch a Chromium browser in headless mode with custom arguments
        browser = await pw.chromium.launch(
            headless=True,
            args=[
                "--window-size=1280,720",         # Set the browser window size
                "--disable-dev-shm-usage",        # Avoid using /dev/shm which can cause issues in containers
                "--ipc=host",                     # Use host-level IPC for better stability
                "--single-process"                # Run the browser in a single process mode
            ],
        )
        
        # Create a new browser context (like an incognito window)
        context = await browser.new_context()
        context.set_default_timeout(5000)
        
        # Open a new page in the browser context
        page = await context.new_page()
        
        # Navigate to your target URL and wait until the network request is committed
        await page.goto("http://localhost:3004", wait_until="commit", timeout=10000)
        
        # Wait for the main page to reach DOMContentLoaded state (optional for stability)
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=3000)
        except async_api.Error:
            pass
        
        # Iterate through all iframes and wait for them to load as well
        for frame in page.frames:
            try:
                await frame.wait_for_load_state("domcontentloaded", timeout=3000)
            except async_api.Error:
                pass
        
        # Interact with the page elements to simulate user flow
        # Click the Login button to navigate to the login form.
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/div/div/div/div[2]/div/div/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Click on the Email tab to switch to email login form.
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div[3]/div[2]/div/button[2]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Input the registered email address 'test' and click Send Verification Code.
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div[3]/div[2]/div[3]/form/div[2]/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('test')
        

        # Input the correct OTP and submit for verification.
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div[3]/div[2]/div[3]/form/div[2]/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('123456')
        

        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div[3]/div[2]/div[3]/form/div[3]/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Clear the email input field, enter the valid registered email 'test@example.com', send verification code again, then input the correct OTP in the OTP field and submit.
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div[3]/div[2]/div[3]/form/div[2]/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('')
        

        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div[3]/div[2]/div[3]/form/div[2]/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('test@example.com')
        

        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div[3]/div[2]/div[3]/form/div[3]/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Input the correct OTP code and click Verify to complete login.
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div[3]/div[2]/form/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('123456')
        

        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div[3]/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Assert that the user is logged in successfully by checking the presence of user greeting text on the dashboard page.
        user_greeting = await frame.locator('text=Good afternoon, Rajeev').text_content()
        assert user_greeting is not None and 'Good afternoon, Rajeev' in user_greeting, 'User greeting not found, login might have failed.'
        # Assert that the page title is the dashboard title after login.
        page_title = await page.title()
        assert page_title == 'WhatsTask - Project Management', f'Unexpected page title after login: {page_title}'
        # Assert that the navigation links expected on the dashboard are present.
        expected_nav_links = ['Dashboard', 'All Tasks', 'Projects', 'My Tasks', 'Team', 'Analytics', 'Templates', 'AI Admin', 'Deleted Tasks']
        for link_text in expected_nav_links:
            link = await frame.locator(f'text={link_text}').first
            assert await link.is_visible(), f'Navigation link {link_text} not visible on dashboard'
        await asyncio.sleep(5)
    
    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()
            
asyncio.run(run_test())
    