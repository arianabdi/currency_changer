import { ApiProperty } from "@nestjs/swagger";
import {IsNotEmpty, IsNumber, MinLength} from "class-validator";

export class CreateCurrencyPair {

    @ApiProperty({
        description: 'Currency Source',
    })
    @MinLength(3)
    @IsNotEmpty()
    from: string;


    @ApiProperty({
        description: 'Currency Destination',
    })
    @MinLength(3)
    @IsNotEmpty()
    to: string;


    @ApiProperty({
        description: 'rate',
    })
    @IsNotEmpty()
    @IsNumber()
    rate: number;
}



export class exchangeBodyDto {
    @ApiProperty({
        description: 'currency want to convert from... minimum length 3',
    })
    @IsNotEmpty()
    @MinLength(3)
    from: string;

    @ApiProperty({
        description: 'currency want to convert to minimum length 3',
    })
    @IsNotEmpty()
    @MinLength(3)
    to: string;

    @ApiProperty({
        description: 'amount',
    })
    @IsNotEmpty()
    amount: number;
}


export class DeleteCurrencyPairDto {
    @ApiProperty({description: 'id of currency pair'})
    @IsNotEmpty()
    @IsNumber()
    id: number;
}