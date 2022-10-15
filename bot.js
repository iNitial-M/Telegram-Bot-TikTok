const Telegraf = require('telegraf');
require('dotenv/config');
const axios = require("axios");
const {X_RAPIDAPI_KEY} = process.env;
const moduloTelegram = require ('./env.module');


const bot = new Telegraf.Telegraf(moduloTelegram.token);
console.log('Bot sedang berjalan');

bot.start(content => {
    const from = content.update.message.from;
    console.log(from);
    content.reply(`Selamat Datang, ${from.first_name}!`);
    content.reply(`Kirim link tiktok dan otomatis video akan terkirim`);
});

bot.on('text', (content, next)=>{
    try{
        const texto = content.update.message.text;
        const id = content.update.message.from.id;
        if(texto.indexOf('tiktok.com')>-1){
        content.reply(`Video kamu sedang di download`);         
        const options = {
            method: 'GET',
            url: 'https://tiktok-download-no-watermark.p.rapidapi.com/download',
            params: {url: texto},
            headers: 
            {'X-RapidAPI-Key': X_RAPIDAPI_KEY,
            'X-RapidAPI-Host': 'tiktok-download-no-watermark.p.rapidapi.com'}
        };

        axios.request(options).then(function (response) {
            console.log('Video terkirim');
            bot.telegram.sendVideo(id, response.data);
        }).catch(function (error) {
            bot.telegram.sendMessage(id,'Ada kesalahan di API');
            console.error(error);            
        });
    }else {
            bot.telegram.sendMessage(id,'Anda tidak memasukkan tautan yang valid, silakan coba lagi');
          }
    

    }catch(e){
        console.log('terjadi kesalahan dalam proses', e);
        content.reply(`Ada masalah dengan program`);
    }

});


bot.startPolling();
