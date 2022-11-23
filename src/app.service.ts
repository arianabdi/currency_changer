import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {CreateCurrencyPair, DeleteCurrencyPairDto, exchangeBodyDto} from './app.dto';
import { PathItem, Response } from './app.model';
import {CurrencyPair} from "./app.entity";

@Injectable()
export class AppService {
    constructor(
        @InjectRepository(CurrencyPair) private readonly currencyRepository: Repository<CurrencyPair>,
    ) { }


    async addPair(createCurrencyPair: CreateCurrencyPair): Promise<Response> {
        try {
            let pair = await this.currencyRepository.findOne({
                where: [{ from: createCurrencyPair.from, to: createCurrencyPair.to }, { from: createCurrencyPair.to, to: createCurrencyPair.from }]
            })


            if (!pair) {
                let newPair = await this.currencyRepository.create(createCurrencyPair);
                await this.currencyRepository.save(newPair);
                return { success: true, message: "pair successfully created!" }
            }


            else {
                pair.from = createCurrencyPair.from
                pair.to = createCurrencyPair.to
                pair.rate = createCurrencyPair.rate

                await this.currencyRepository.save(pair);
                return { success: true, message: "pair successfully updated!" }
            }

        } catch (error) {
            console.log(error.message);
            return { success: false, message: error.message }

        }
    }


    async convert(exchangeBodyDto: exchangeBodyDto): Promise<Response> {
        try {
            let { from, to, amount } = exchangeBodyDto
            // نتایج جدول را با حذف مقادیر تکراری(در صورت وجود) برمیگرداند
            let allCurrencies = await this.currencyRepository.createQueryBuilder('currency')
                .distinct(true)
                .select(['currency.from', 'currency.to', 'currency.rate'])
                .getRawMany();

            // در هر حلقه اگر rate برای ارزی وجود داشته باشه به اون اضافه میکنه
            let graph = allCurrencies.reduce((previousResult, pair) => {

                previousResult[pair.currency_from] = previousResult[pair.currency_from] || [];
                previousResult[pair.currency_to] = previousResult[pair.currency_to] || [];

                previousResult[pair.currency_from].push({ to: pair.currency_to, rate: pair.currency_rate });
                previousResult[pair.currency_to].push({ to: pair.currency_from, rate: 1 / pair.currency_rate });

                return previousResult;
            }, Object.create(null));



            if (this.shortestPath(graph, from, to)) {
                let path = this.shortestPath(graph, from, to)
                let exchangeRate = amount || 1


                path.forEach(elm => {
                    exchangeRate = elm.rate / exchangeRate
                });

                return { success: true, message: "get exchange rate successfully", data: exchangeRate }
            }
            else {
                return { success: false, message: "No data available" }
            }
        } catch (error) {
            return { success: false, message: error.message }
        }
    }



    shortestPath(graph, from, to): Array<PathItem> {
        try {

            let queue = [[(from), []]]
            let currencySet = new Set;
            let path;


            while (queue.length) {
                let [head, [...path], rate] = queue.shift();

                rate = rate ? rate : 1
                path.push({ head: head, rate });

                if (head === to) {
                    console.log('Hierarchy: ', path);
                    return path
                };

                if (!currencySet.has(head) && graph[head]) {
                    queue.push(...graph[head].map(h => {
                        return [h.to, path, h.rate]
                    }));

                }
                currencySet.add(head);
            }
        } catch (error) {
            throw new Error(error.message);
        }
    }


    async deletePair(deleteCurrencyPairDto: DeleteCurrencyPairDto) {

        try {
            await this.currencyRepository.createQueryBuilder('pair')
                .delete()
                .where("id = :id", { id: deleteCurrencyPairDto.id })
                .execute()

            return { success: true, message: "Pair successfully deleted!" }

        } catch (error) {
            return { success: false, message: error.message }
        }

    }
}