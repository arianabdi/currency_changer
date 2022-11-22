import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity("pair")
export class CurrencyPair {
    @PrimaryGeneratedColumn({
        type: 'bigint',
        name: 'pair_id',
    })
    id: number;

    @Column({
        nullable: false,
        default: '',
    })
    from: string;

    @Column({
        nullable: false,
        default: '',
    })
    to: string;

    @Column({
        type: "float",
        default: 0.0,
    })
    rate: number;
}