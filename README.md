# csvutil
- Diff, convert, and preview csv files
- Supports `csv`, `markdown`, and `terminal-friendly` output
- Works with large files
- Small memory footprint (uses read streams)

## Terminal-friendly Output
![screenshot](https://github.com/aaron9000/csvutil/blob/master/assets/screenshot.png)
--


## Installation
```
npm install -g csvutil
```


## Recipes

##### See visual diff of two files
```csvutil -a sample_a.csv -b sample_b.csv```

##### Preview the first 30 rows
```csvutil -a sample_a.csv -r 30```

##### Preview all rows
```csvutil -a sample_a.csv -r 0```

##### Render a markdown snippet
```csvutil -a sample_a.csv -o md```

##### Save diff to a file
```csvutil -a sample_a.csv -b sample_b.csv -o csv > file.csv```


## Argument Reference
|                                               long |                                              short |                                               type |                                        description |                                            default |
|----------------------------------------------------|----------------------------------------------------|----------------------------------------------------|----------------------------------------------------|----------------------------------------------------|
| `                                        --path-a` | `                                              -a` | `                                       file path` | `                                 source csv path` | `                                            null` |
| `                                        --path-b` | `                                              -b` | `                                       file path` | `                  comparison csv path (for diff)` | `                                            null` |
| `                                        --output` | `                                              -o` | `                                          string` | `                   output format (md|csv|pretty)` | `                                          pretty` |
| `                                          --rows` | `                                              -r` | `                                         integer` | `            max rows to output (0 for unlimited)` | `                                              10` |
| `                                         --width` | `                                              -w` | `                                         integer` | `      max width for pretty & md columns (5 - 50)` | `                                              16` |


## Diff Example

##### Sample A
|            row |             id |   credit_limit |         gender |
|----------------|----------------|----------------|----------------|
|              1 |          25000 |          30000 |              1 |
|              2 |          25001 |         410000 |              1 |
|              3 |          25002 |         260000 |              1 |
|              4 |          25003 |          50000 |              1 |
|              5 |          25004 |          31000 |              1 |

##### Sample B
|            row |             id |   credit_limit |         gender |
|----------------|----------------|----------------|----------------|
|              1 |          25000 |          30000 |              1 |
|              2 |          25001 |         410000 |              1 |
|              3 |          25002 |         260000 |              2 |
|              4 |          25003 |          50000 |              1 |
|              5 |          25004 |          31000 |              2 |

##### Diff
|            row |             id |   credit_limit |         gender |
|----------------|----------------|----------------|----------------|
|              3 |                |                |              2 |
|              5 |                |                |              2 |



## Run Tests
```
npm install
npm run test
```
