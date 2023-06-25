export function page404() {

    NABU.body(
        {
            div: {
                id: 'loginPage',
                class: 'loginPage',
                child: [
                    {
                        h1:{
                            text:"this pages not fund"
                        },
                    }
                ],
            },
        },
        {
            id: 'hayder',
            style: {
                margin: '0px',
                background: 'red'
            }

        }
    )
}