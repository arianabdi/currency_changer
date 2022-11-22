
این پروژه فرآیند پیدا کردن سریع ترین مسیر برای تبدیل ارز ها به هم را با استفاده از الگوریتم Bellman-ford انجام میدهد.



# توضیح تابع convert

ابتدا تمام pair ها را با حذف مقادیر تکراری (با استفاده از distinct) از پایگاه داده، fetch میکنیم

نتیجه کوئری به شکل زیر خواهد بود:

```aidl
[
  { currency_from: 'USD', currency_to: 'EUR', currency_rate: 0.86 },
  { currency_from: 'CAD', currency_to: 'GBP', currency_rate: 0.58 },
  { currency_from: 'USD', currency_to: 'CAD', currency_rate: 1.34 }
]

```
## ایجاد گراف

.سپس اقدام به ایجاد گراف میکنیم، برای اینکار از تابع reduce استفاده میکنیم. این تابع دو ارگومان دارد. مقدار accumulator(نتیجه قبلی) و currentValue (مقدار فعلی).
به این صورت که به ازای هر ارز، شاخه بندی نسبت به ارزهای دیگر انجام می شود که نتیجه ای مشابه زیر خواهد داشت:
```aidl
{
  USD: [ { to: 'EUR', rate: 0.86 }, { to: 'CAD', rate: 1.34 } ],
  EUR: [ { to: 'USD', rate: 1.1627906976744187 } ],
  CAD: [ { to: 'GBP', rate: 0.58 }, { to: 'USD', rate: 0.7462686567164178 } ],
  GBP: [ { to: 'CAD', rate: 1.7241379310344829 } ]
}
```

این اقدام به این شکل مرحله به مرحله انجام میشود. فرض کنید در حلقه ای هستیم که pair مامقدار زیر خواهد بود
```aidl
{ currency_from: 'USD', currency_to: 'EUR', currency_rate: 0.86 }
```
در حلقه اول گراف ما به شکل زیر خواهد شد
```aidl
{
  USD: [ { to: 'EUR', rate: 0.86 } ],
  EUR: [ { to: 'USD', rate: 1.1627906976744187 } ]
}

```

حال که حلقه دوم یعنی pair که برابر با مقدار زیر است میرویم
```aidl
  { currency_from: 'CAD', currency_to: 'GBP', currency_rate: 0.58 },
```

حال گراف ما به شکل زیر خواهد شد
```aidl
{
  USD: [ { to: 'EUR', rate: 0.86 } ],
  EUR: [ { to: 'USD', rate: 1.1627906976744187 } ],
  CAD: [ { to: 'GBP', rate: 0.58 } ],
  GBP: [ { to: 'CAD', rate: 1.7241379310344829 } ]
}

```


و در آخر به سراغ pair به شکل زیر میرویم که اخرین pair است.
```aidl
{ currency_from: 'USD', currency_to: 'CAD', currency_rate: 1.34 }
```


چون قبلا راس usd ایجاد شده بود و فقط شاخه EUR درونش بود، حالا مقدار CADهم به ان اضافه میشود.
```aidl
  USD: [ { to: 'EUR', rate: 0.86 }, { to: 'CAD', rate: 1.34 } ],
  EUR: [ { to: 'USD', rate: 1.1627906976744187 } ],
  CAD: [ { to: 'GBP', rate: 0.58 }, { to: 'USD', rate: 0.7462686567164178 } ],
  GBP: [ { to: 'CAD', rate: 1.7241379310344829 } ]
```

-------------



## گرفتن شاخه بندی نتایج


یک نمونه از تبدیل ارزها مثلا تبدیل CAD به EUR یک دسته بندی مشابه زیر خواهد داشت. به این ترتیب که ابتدا rate  خود cad با cad محاسبه میشه، سپس با usd و سپسUSD  با EUR
```aidl
[
  { head: 'CAD', rate: 1 },
  { head: 'USD', rate: 0.7462686567164178 },
  { head: 'EUR', rate: 0.86 }
]

```


