const getData = async () => {
    // buttons data
    const buttonData = await fetch('https://openapi.programming-hero.com/api/videos/categories')
        .then(res => res.json())
        .catch(error => console.error(error));

    const buttonsContainer = document.querySelector('.filter-buttons-container');
    buttonData.data.map((item) => {
        const button = document.createElement('button');
        button.className = 'bg-gray-300 hover:bg-gray-400 font-medium rounded text-sm px-5 py-2';
        button.innerText = item.category;
        buttonsContainer.appendChild(button)

        // button click handler
        button.addEventListener('click', () => {
            const cardContainer = document.getElementById('card-container')
            cardContainer.innerHTML = '';
            displayAllData(item?.category_id)

        })
    });
};
getData()

const displayAllData = async (category_id, withSortedData) => {
    try {
        const response = await fetch(`https://openapi.programming-hero.com/api/videos/category/${category_id}`)
        const data = await response.json();
        const cardContainer = document.getElementById('card-container');

        if (data?.data?.length === 0) {
            const content = `<div class="mt-48">
                               <img class="mx-auto" src="/Icon.png" alt="no-content" />
                               <h1 class="text-5xl text-center mt-5">Oops!! Sorry, There is no <br/> content here</h1>
                            </div>
                            `;
            cardContainer.className = 'grid grid-cols-1 place-items-center mt-5 h-[100vh]';
            cardContainer.innerHTML = content;
            return;
        };

        cardContainer.className = 'grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-2 lg:gap-4 mt-5';

        if (withSortedData) {
            const sorted = data?.data?.sort((a, b) => {
                const valueA = parseFloat(a?.others?.views);
                const valueB = parseFloat(b?.others?.views);
                return valueB - valueA;
            });

            cardContainer.innerHTML = '';

            sorted?.forEach((item) => {
                console.log(item)
                const card = getCard(item)
                cardContainer.appendChild(card)
            })
            return;
        }

        data?.data?.forEach((item) => {
            const card = getCard(item)
            cardContainer.appendChild(card)
        })
    }
    catch {
        (err) => {
            console.log(err);
        };
    };
};

displayAllData('1000')

// sort handler 
const sortBtn = document.getElementById('sorted_btn');
console.log(sortBtn)
sortBtn?.addEventListener('click', () => {
    displayAllData('1000', true)
}, false)

// dynamic card 
function getCard(data) {
    const user = data?.authors[0]
    const isVerified = Boolean(user?.verified);
    const posted_date = data?.others?.posted_date;
    const timesAgo = convertTimestamp(data?.others?.posted_date);

    const cardEl = document.createElement('div');
    cardEl.className = 'bg-white border border-gray-200 rounded-lg shadow mb-4 sm:mb-0 relative';
    cardEl.innerHTML = `
                 <img class="rounded-t-lg w-full h-48" src="${data?.thumbnail}" alt="" />
                 
                 ${posted_date ? `<p class="bg-gray-800 text-xs text-gray-50 rounded-lg absolute right-2 top-40 px-3 py-1">${timesAgo}</p>` : ''}

                 <div class="p-5">
                    <div class="flex items-center gap-2 mb-3">
                       <img class="inline-block h-12 w-12 rounded-full ring-2 ring-white" src="${user?.profile_picture}" alt="profile" />
                       <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900">${data?.title}</h5>
                    </div>
                 
                   <div class="flex items-center gap-3">
                      <p class="text-gray-500">${user?.profile_name}</p>
                      ${isVerified ? `<svg aria-hidden="true" class="w-5" xmlns="http://www.w3.org/2000/svg" fill="lightgreen" viewBox="0 0 21 21">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m6.072 10.072 2 2 6-4m3.586 4.314.9-.9a2 2 0 0 0 0-2.828l-.9-.9a2 2 0 0 1-.586-1.414V5.072a2 2 0 0 0-2-2H13.8a2 2 0 0 1-1.414-.586l-.9-.9a2 2 0 0 0-2.828 0l-.9.9a2 2 0 0 1-1.414.586H5.072a2 2 0 0 0-2 2v1.272a2 2 0 0 1-.586 1.414l-.9.9a2 2 0 0 0 0 2.828l.9.9a2 2 0 0 1 .586 1.414v1.272a2 2 0 0 0 2 2h1.272a2 2 0 0 1 1.414.586l.9.9a2 2 0 0 0 2.828 0l.9-.9a2 2 0 0 1 1.414-.586h1.272a2 2 0 0 0 2-2V13.8a2 2 0 0 1 .586-1.414Z" /></svg>` : ''}
                  </div>
                    <p class="text-gray-500">${data?.others?.views}</p>
                </div>
    `;
    return cardEl;
}

// get converted time
function convertTimestamp(timestamp) {
    // Create a new Date object
    const date = new Date(timestamp * 1000);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    // Format the result as a string
    return hours + ' hrs ' + minutes + ' min ago ';
};
