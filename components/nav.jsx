const MENU_ITEMS = [
  {
    name: "Nervos",
    href: "https://www.nervos.org/",
  },
  {
    name: "Explorer",
    href: "https://explorer.nervos.org/",
  },
];

function MenuItems({ items }) {
  return (
    <div class="justify-between items-center w-full flex w-auto order-1">
      <ul class="flex mt-4 flex-row space-x-8 mt-0">
        {items.map((item) => (
          <li>
            <a
              href={item.href}
              class="block py-2 pr-4 pl-3 text-white rounded"
              aria-current="page"
            >
              {item.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Nav() {
  return (
    <nav class="bg-[#232323] px-2 sm:px-4 py-2.5">
      <div class="container flex flex-wrap justify-between items-center mx-auto">
        <a href="/" class="flex items-center">
          <img src="/logo.svg" class="h-6 sm:h-9" alt="Nervos Logo" />
        </a>
        <MenuItems items={MENU_ITEMS} />
      </div>
    </nav>
  );
}
