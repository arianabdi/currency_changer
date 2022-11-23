import {Body, Controller, Delete, Get, Post, Query, UsePipes, ValidationPipe} from '@nestjs/common';
import {AppService} from './app.service';
import {ApiBody, ApiOperation} from '@nestjs/swagger';
import {Response} from './app.model';
import {CreateCurrencyPair, DeleteCurrencyPairDto, exchangeBodyDto} from "./app.dto";

@Controller("/currency")
export class AppController {
    constructor(private readonly appService: AppService) {
    }


    @Post('pair')
    @ApiOperation({summary: 'create currencyPair if its not exist in DB else update the rate'})
    @ApiBody({
        description: 'List of Pairs',
        type: [CreateCurrencyPair],
    })
    @UsePipes(ValidationPipe)
    async addPair(@Body() body: CreateCurrencyPair[]): Promise<Response> {
        return this.appService.addPair(body);
    }

    @Get('exchange?')
    @ApiOperation({summary: 'if amount exist in the query convert the amount to the given currency else give the exchange rate'})
    async convert(@Query() query: exchangeBodyDto): Promise<Response> {
        return this.appService.convert(query);
    }


    @Delete('pair')
    @ApiOperation({summary: 'Delete a particular pair'})
    async deletePair(@Body() body: DeleteCurrencyPairDto): Promise<void> {
        console.log('delete', body)
        await this.appService.deletePair(body);
    }
}