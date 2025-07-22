import {test, expect} from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('https://www.wikipedia.org')
});

test('1 слово', async({page}) => {
  const searchRequest = "Playwright"
  await page.locator('input[name="search"]').fill(searchRequest);
  await expect(page.locator('input[name="search"]')).toHaveValue(searchRequest);
  await page.locator('input[name="search"]').press('Enter');    
  await expect(page.locator('h1#firstHeading span.mw-page-title-main')).toHaveText(searchRequest);
})

test('2 слова', async({page}) => {
    const searchRequest = "Playwright test"
    await page.locator('input[name="search"]').fill(searchRequest);
    await expect(page.locator('input[name="search"]')).toHaveValue(searchRequest);
    await page.locator('input[name="search"]').press('Enter');    
    await expect(page.locator('input.oo-ui-inputWidget-input')).toHaveValue(searchRequest);
    await expect(page.locator('h1#firstHeading')).toHaveText('Search results');
})

test('5 слов', async({page}) => {
    const searchRequest = "Playwright testing framework JavaScript UI"
    await page.locator('input[name="search"]').fill(searchRequest);
    await expect(page.locator('input[name="search"]')).toHaveValue(searchRequest);
    await page.locator('input[name="search"]').press('Enter');    
    await expect(page.locator('input.oo-ui-inputWidget-input')).toHaveValue(searchRequest);
    await expect(page.locator('h1#firstHeading')).toHaveText('Search results');
})

test('1 буква', async({page}) => {
    const searchRequest = "P"
    await page.locator('input[name="search"]').fill(searchRequest);
    await expect(page.locator('input[name="search"]')).toHaveValue(searchRequest);
    await page.locator('input[name="search"]').press('Enter');    
    await expect(page.locator('h1#firstHeading')).toHaveText(searchRequest);
})

test('Пустое поле', async({page}) => {
    await page.locator('input[name="search"]').press('Enter');    
    await expect(page.locator('h1#firstHeading')).toHaveText('Search');
})

test('Ввод в врехнем регистре', async({page}) => {
    const searchRequest = "PLAYWRIGHT"
    const lowRegister = "Playwright"
    await page.locator('input[name="search"]').fill(searchRequest);
    await expect(page.locator('input[name="search"]')).toHaveValue(searchRequest);
    await page.locator('input[name="search"]').press('Enter');    
    await expect(page.locator('h1#firstHeading span.mw-page-title-main')).toHaveText(lowRegister);
})

test('Цифры', async({page}) => {
    const searchRequest = "1234567890"
    await page.locator('input[name="search"]').fill(searchRequest);
    await expect(page.locator('input[name="search"]')).toHaveValue(searchRequest);
    await page.locator('input[name="search"]').press('Enter');    
    await expect(page.locator('h1#firstHeading')).toHaveText(searchRequest);
})


// test('', async({page}) => {
  
// })

// test('', async({page}) => {
  
// })

// test('', async({page}) => {
  
// })