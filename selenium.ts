import {Request, Response} from 'express';
const { Builder, By } = require('selenium-webdriver');
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
    console.log(`Example app listening at http://localhost:${port}`)
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

