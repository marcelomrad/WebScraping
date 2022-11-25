import {Request, Response} from 'express';
const { Builder, By, Key, EC, WebDriverWait} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

const express = require('express');

const app = express();

const port = 3000
app.get('/',async (request: Request, response: Response) => {
    try{
        const data = await WebScrapingLocalTest();
        response.status(200).json(data)
    }catch(error){
        console.log(error)
    }
})
app.listen(port, () => {
    console.log(`listening at http://localhost:${port}`)
})

async function WebScrapingLocalTest() {
    const driver = await new Builder().forBrowser('chrome').build();
    try {
      
      await driver.get('https://www.youtube.com/c/LambdaTest/videos');
      const allVideos = await driver.findElements(
        By.css('ytd-rich-item-renderer.style-scope.ytd-rich-grid-row')
      );
      return await getVideos(allVideos)
    } catch (error) {
        console.log(error);
    } finally {
      await driver.quit();
    }
   }

async function getVideos(videos: any) {
    let videoDetails = [];
    try {
      for (const video of videos) {
        const title = await video.findElement(By.id('video-title')).getText();
        const views = await video
          .findElement(By.xpath(".//*[@id='metadata-line']/span[1]"))
          .getText();
        const date = await video
          .findElement(By.xpath(".//*[@id='metadata-line']/span[2]"))
          .getText();
        videoDetails.push({
          title: title ?? '',
          views: views ?? '',
          publishedDate: date ?? '',
        });
        }
    } catch (error) {
      console.log(error);
    }
    videoDetails.sort((a: any, b: any) => {
        a.views = a.views.replace(/[^0-9]/g, '');
        b.views = b.views.replace(/[^0-9]/g, '');
        return b.views - a.views;
        }); 
    return videoDetails;
   }

   app.get('/test',async (request: Request, response: Response) => {
    try{
        let links = await Scraping();
        response.status(200).json(links)
    }catch(error){
        console.log(error)
    }
})

async function Scraping(){
    const driver = await new Builder().forBrowser('chrome').build()
    let linksDetails = [];
    try {
        let elemento
        await driver.get('https://jurisprudencia.stf.jus.br/pages/search')
        await driver.sleep(2000)

        await driver.findElement(By.className('mat-icon notranslate mat-tooltip-trigger icon cursor-pointer ml-5 material-icons mat-icon-no-color')).click()
        

        // SELECIONA MONOCRATICAS
        (async function getMonocraticas() {
            try {
              driver.wait(driver, 20).until(EC.elementToBeClickable(By.xpath('/html/body/app-root/app-home/main/search/div/search-input/div/div/div/div/div[2]/div/div[1]/div/mat-radio-group/span[4]/mat-radio-button/label/div[1]/div[2]')))
              elemento = await driver.findElement(By.xpath('/html/body/app-root/app-home/main/search/div/search-input/div/div/div/div/div[2]/div/div[1]/div/mat-radio-group/span[4]/mat-radio-button/label/div[1]/div[2]'))
              elemento.click()
              driver.sleep(3)
            } catch (error) {
              console.log(error);
            }
          })().then(
            () => console.log('SUCCESS'),
            (err: any) => console.error('ERROR: ' + err)
          )
        
          // DESABILITA BUSCA ENTRE ASPAS
        elemento = await driver.findElement(By.xpath('/html/body/app-root/app-home/main/search/div/search-input/div/div/div/div/div[2]/div/div[4]/div/div[1]/div[2]/mat-checkbox[2]/label/div/input'))
        driver.executeScript("arguments[0].click();", elemento);

        // #HABILITA BUSCA POR RADICAIS
        elemento = await driver.findElement(By.xpath('/html/body/app-root/app-home/main/search/div/search-input/div/div/div/div/div[2]/div/div[4]/div/div[1]/div[2]/mat-checkbox[1]/label/div/input'))
        driver.executeScript("arguments[0].click();", elemento);

        // #CAMPO DE BUSCA
        elemento = driver.findElement(By.xpath('/html/body/app-root/app-home/main/search/div/search-input/div/div/div/div/div[2]/div/div[2]/div/mat-form-field/div/div[1]/div[3]/input'))
        elemento.sendKeys('direito civil')

        // #BOTAO PESQUISAR
        elemento = await driver.findElement(By.xpath('/html/body/app-root/app-home/main/search/div/search-input/div/div/div/div/div[2]/div/div[4]/div/div[2]/button[2]'))
        elemento.click()

        // #Filtra Datas
        (async function filtrarDatas() {
            try {
            driver.wait(driver, 20).until(EC.elementToBeClickable(By.xpath('/html/body/app-root/app-home/main/search/div/div/div/div[1]/div[2]/div[3]/div/div[2]/mat-form-field[1]/div/div[1]/div[3]/input')))
             elemento = await driver.findElement(By.xpath('/html/body/app-root/app-home/main/search/div/div/div/div[1]/div[2]/div[3]/div/div[2]/mat-form-field[1]/div/div[1]/div[3]/input'))
             elemento.click()
             elemento.sendKeys('01/01/2015')
              driver.sleep(3)
            } catch (error) {
              console.log(error);
            }
          })();
      
          return true
      } catch (error) {
          console.log(error);
          return false
      } finally {
        await driver.quit();
      }
      
}



