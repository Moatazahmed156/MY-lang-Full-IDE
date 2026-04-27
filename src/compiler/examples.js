export const EXAMPLES = [
  {
    name: 'Hello World',
    code: `main {
  print("Hello, World!")
  print("Welcome to MZ-Lang!")
}`,
  },
  {
    name: 'Variables & If/Else',
    code: `main {
  number x = 10
  number y = 3

  if (x > 5) {
    print("x is Big:", x)
  } else {
    print("x is Small:", x)
  }

  number result = x + y
  print("x + y =", result)
}`,
  },
  {
    name: 'While Loop',
    code: `main {
  number i = 1
  number sum = 0

  while (i <= 10) {
    sum = sum + i
    i = i + 1
  }

  print("Sum 1..10 =", sum)
}`,
  },
  {
    name: 'Arrays',
    code: `main {
  Array nums = [10, 20, 30, 40, 50]

  number i = 0
  number total = 0

  while (i < 5) {
    total = total + nums[i]
    print("nums[", i, "] =", nums[i])
    i = i + 1
  }

  print("Total:", total)
}`,
  },
  {
    name: 'FizzBuzz',
    code: `main {
  number i = 1

  while (i <= 20) {
    number rem3 = i % 3
    number rem5 = i % 5

    if (rem3 == 0 and rem5 == 0) {
      print("FizzBuzz")
    } else {
      if (rem3 == 0) {
        print("Fizz")
      } else {
        if (rem5 == 0) {
          print("Buzz")
        } else {
          print(i)
        }
      }
    }

    i = i + 1
  }
}`,
  },
  {
    name: 'Fibonacci',
    code: `main {
  number a = 0
  number b = 1
  number n = 15
  number count = 0

  print("Fibonacci sequence:")

  while (count < n) {
    print(a)
    number temp = a + b
    a = b
    b = temp
    count = count + 1
  }
}`,
  },
  {
    name: 'Text & Booleans',
    code: `main {
  text name = "MZ-Lang"
  text version = "1.0"
  boolean isReady = true

  if (isReady) {
    print("Language:", name, "v" + version)
    print("Status: Ready!")
  } else {
    print("Not ready yet")
  }

  text greeting = "Hello, " + name + "!"
  print(greeting)
}`,
  },
  {
    name: 'Bubble Sort',
    code: `main {
  Array arr = [64, 34, 25, 12, 22, 11, 90]
  number n = 7
  number i = 0

  while (i < n - 1) {
    number j = 0
    while (j < n - i - 1) {
      if (arr[j] > arr[j + 1]) {
        number temp = arr[j]
        arr[j] = arr[j + 1]
        arr[j + 1] = temp
      }
      j = j + 1
    }
    i = i + 1
  }

  print("Sorted array:")
  number k = 0
  while (k < n) {
    print(arr[k])
    k = k + 1
  }
}`,
  },
];

export const DEFAULT_CODE = EXAMPLES[1].code;
