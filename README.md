#csvutil

##Features
- Diff, convert, and preview csv files
- Supports `csv`, `markdown`, and `terminal-friendly` output
- Works with large files
- Small memory footprint (uses read streams)

##Installation
```
npm install -g csvutil
```


##Diff Example

#####Sample A
            row |             id |   credit_limit |         gender
----------------|----------------|----------------|----------------
              1 |          25000 |          30000 |              1
              2 |          25001 |         410000 |              1
              3 |          25002 |         260000 |              1
              4 |          25003 |          50000 |              1
              5 |          25004 |          31000 |              1

#####Sample B
            row |             id |   credit_limit |         gender
----------------|----------------|----------------|----------------
              1 |          25000 |          30000 |              1
              2 |          25001 |         410000 |              1
              3 |          25002 |         260000 |              2
              4 |          25003 |          50000 |              1
              5 |          25004 |          31000 |              2

#####Diff
            row |             id |   credit_limit |         gender
----------------|----------------|----------------|----------------
              3 |                |                |              2
              5 |                |                |              2


##Colors & Terminal-friendly Output
![screenshot](https://github.com/aaron9000/csvutil/blob/master/assets/screenshot.png)

##Recipes

#####See visual diff of two files
```csvutil -a sample_a.csv -b sample_b.csv```

#####Preview the first 30 rows
```csvutil -a sample_a.csv -r 30```

#####Preview all rows
```csvutil -a sample_a.csv -r 0```

#####Render a markdown snippet
```csvutil -a sample_a.csv -o md```

#####Save diff to a file
```csvutil -a sample_a.csv -b sample_b.csv -o csv > file.csv```

##Run Tests
```
npm install
npm run test
```