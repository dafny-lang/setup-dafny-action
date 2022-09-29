// A file to verify _something_
module Test {
  predicate test()
    ensures test() ==> false
  {
    false
  }
}
