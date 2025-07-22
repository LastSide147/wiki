import { test, expect } from '@playwright/test';

test.beforeEach(async ({page}) => {
  await page.goto('https://www.wikipedia.org')
})

test('Сайт открывается', async ({page}) => {
  await page.goto('https://www.wikipedia.org')

  const name = "Wikipedia";
  
  await expect(page.locator('.central-textlogo-wrapper', 'Wikipedia')).toBeVisible();
  await expect(page.locator('.central-textlogo-wrapper', 'Свободная энциклопедия')).toBeVisible();
})

test('Есть название сайта - Wikipedia', async({page}) => {
  await expect(page.locator('span.central-textlogo__image.sprite.svg-Wikipedia_wordmark')).toHaveText('Wikipedia');
})

test('Поисковое поле принимает ввод', async ({page}) =>{
  const searchWord = 'Яблоко'
  await page.locator('input[name="search"]').fill(searchWord); 
  await expect(page.locator('input[name="search"]')).toHaveValue(searchWord); 
})

test('Поиск на главной странице', async ({page}) =>{
  await page.goto('https://www.wikipedia.org')
  const searchWord = 'Яблоко'
  await test.step('Ввод поискового слова и поиск по клавише "Enter"', async() => {
    await page.locator('input[name="search"]').fill(searchWord);
    await page.keyboard.press('Enter');
  })
  // await test.step('Ввод поискового слова и поиск по кнопке "Поиск"', async() => {
  //   await page.locator('input[name="search"]').fill(searchWord);
  //   // await page.locator('button:has(i:has-text("Search"))').click();
  //   await page.locator('button[aria-label="Search"]').click();
  // })
})

test('Результат соответсвует поисковому запросу', async ({page}) =>{
  const searchWordApple = 'Playwright'

  await page.locator('input[name="search"]').fill(searchWordApple);
  await page.locator('input[name="search"]').press('Enter');
  await expect(page.locator('h1#firstHeading span.mw-page-title-main')).toHaveText(searchWordApple);
})


test('Поиск со страницы с результатом запроса', async ({page}) =>{
  const searchWordPear = "Груша"
  await test.step('На странице есть активное поисковое поле', async () => {
    await page.goto('https://ru.wikipedia.org/wiki/%D0%AF%D0%B1%D0%BB%D0%BE%D0%BA%D0%BE', { waitUntil: 'domcontentloaded'});
    await expect(page.locator('h1#firstHeading span.mw-page-title-main')).toHaveText('Яблоко');
    await expect(page.locator('input[name="search"]')).toBeEnabled();
  })

  await test.step('Клавиша "Enter" запускает поиск', async() => {
    await page.locator('input[name="search"]').fill(searchWordPear);
    await page.keyboard.press('Enter');
    await expect(page.locator('h1#firstHeading span.mw-page-title-main')).toHaveText(searchWordPear);
  })
})


test('При вводе появляются активные поисковые подсказки ', async ({page}) => {

  const searchRequest = "Я";

  await page.locator('input[name="search"]').fill(searchRequest);
  await expect(page.locator('.suggestions-dropdown')).toBeVisible(); //Выпадающий список есть

  await test.step('Появляется 6 подсказок, они содержат ссылки', async() => {
    const suggestionLinks = page.locator('.suggestions-dropdown a');
    const count = await suggestionLinks.count();
    for(let i = 0; i < count; i++) {
      await expect(suggestionLinks.nth(i)).toBeVisible();
      await expect(suggestionLinks.nth(i)).toHaveAttribute('href', expect.stringContaining('https://ru.wikipedia.org/wiki/'));
      console.log(`Suggestion ${i + 1}: ${await suggestionLinks.nth(i).getAttribute('href')}`);
    }
  })
  await test.step('У подсказок есть заглавный текст и описание', async() => {
    const suggestionLinks = page.locator('.suggestions-dropdown a');
    const count = await suggestionLinks.count();
    for(let i = 0; i < count; i++) {
      await expect(suggestionLinks.nth(i).locator('.suggestion-text h3.suggestion-title')).not.toBeEmpty(); // Проверяем, что suggestion-title не пустой
      await expect(suggestionLinks.nth(i).locator('.suggestion-text p.suggestion-description')).not.toBeEmpty();
    }
  })
});

