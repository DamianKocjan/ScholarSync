import { Listbox, Transition } from "@headlessui/react";
import { CaretDown, Check } from "phosphor-react";
import React, { Fragment, useCallback, useState } from "react";
import { Button } from "../shared/Button";
import { Input } from "../shared/Input/Input";

const conditionTypes = ["NEW", "USED", "UNKNOWN"];

export type Filters = {
  title?: string;
  condition?: "NEW" | "USED" | "UNKNOWN";
  minPrice?: number;
  maxPrice?: number;
  category?: string;
};

interface FilterProps {
  data: Filters;
  setData: (value: Filters) => void;
}

export const Filter: React.FC<FilterProps> = ({ data, setData }) => {
  const [filters, setFilters] = useState(data);

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setData(filters);
    },
    [filters, setData]
  );

  return (
    <div className="divide-y divide-gray-200 rounded-lg bg-white shadow shadow-indigo-300 transition-shadow hover:shadow-md">
      <div className="px-4 py-5 sm:px-6">
        <div className="flex items-center gap-4">
          <h3 className="text-lg">Filter</h3>
        </div>
      </div>
      <div className="px-4 py-5 sm:p-6">
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="title" className="sr-only">
              Product name
            </label>
            <Input
              name="title"
              id="title"
              placeholder="Product name..."
              value={filters.title}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  title: e.target.value,
                })
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label htmlFor="minPrice" className="sr-only">
                Min price
              </label>
              <Input
                name="minPrice"
                id="minPrice"
                type="number"
                inputMode="numeric"
                pattern="^\d*(\.\d{0,2})?$"
                placeholder="Min price..."
                value={filters.minPrice}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    minPrice: +e.target.value,
                  })
                }
              />
            </div>
            <div>
              <label htmlFor="maxPrice" className="sr-only">
                Max price
              </label>
              <Input
                name="maxPrice"
                id="maxPrice"
                type="number"
                inputMode="numeric"
                pattern="^\d*(\.\d{0,2})?$"
                placeholder="Max price..."
                min="0"
                value={filters.maxPrice}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    maxPrice: +e.target.value,
                  })
                }
              />
            </div>
            <div>
              <label htmlFor="category" className="sr-only">
                Category
              </label>
              <Input
                name="category"
                id="category"
                placeholder="Category..."
                value={filters.category}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    category: e.target.value,
                  })
                }
              />
            </div>
            <div className="border-gray-200 focus-within:border-b-2 focus-within:border-indigo-600">
              <Listbox
                value={filters.condition}
                onChange={(val) =>
                  setFilters({
                    ...filters,
                    condition: val,
                  })
                }
              >
                <div className="relative mt-1">
                  <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-300 sm:text-base">
                    <span className="block truncate">
                      Condition: {filters.condition?.toLowerCase() || "ALL"}
                    </span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <CaretDown
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </span>
                  </Listbox.Button>
                  <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                      {conditionTypes.map((type, i) => (
                        <Listbox.Option
                          key={`condition-type-${i}`}
                          className={({ active }) =>
                            `relative cursor-default select-none py-2 pl-10 pr-4 ${
                              active
                                ? "bg-indigo-100 text-indigo-900"
                                : "text-gray-900"
                            }`
                          }
                          value={type}
                        >
                          {({ selected }) => (
                            <>
                              <span
                                className={`block truncate ${
                                  selected ? "font-medium" : "font-normal"
                                }`}
                              >
                                {type.toLowerCase()}
                              </span>
                              {selected ? (
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-indigo-600">
                                  <Check
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                </span>
                              ) : null}
                            </>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              </Listbox>
            </div>
          </div>

          <Button type="submit" className="flex items-center justify-center">
            Filter
          </Button>
        </form>
      </div>
    </div>
  );
};
