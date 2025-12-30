'use client';
export default function Error({ error, reset }) {
    console.log(error, 'cusEr')
    if (error.message === 'SERVER_ERROR') {
        return <h1>ارور 500</h1>;
    }
    return (
        <html>
            <body>
                <div className="custom-container">
                    <h2>یه خطای غیرمنتظره رخ داد</h2>
                    <p>لطفاً دوباره تلاش کن</p>
                    <button onClick={() => reset()}>
                        تلاش مجدد
                    </button>
                </div>
            </body>
        </html>
    );
}