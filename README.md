![brain-matvis-d3](https://github.com/cabeen/brain-matvis-d3/raw/main/media/splash.png)

# brain-matvis-d3

This package shares code for web-based visualization of brain connectivity
data, built using [D3.js](https://d3js.org), a Javascript library for
interactive documents.  This should potentially work with any data that can be
stored in a connectivity matrix or graph, that is, numerical measures defined
for pairs of variables.  For example, this could be measures of structural
integrity between brain regions, or it could be something else, like functional
connectivity or statistical parameters from a group analysis.  Two different
visualization approaches included here and illustrated above.  The first is a
`chord` diagram that visualizes brain regions on a circle with interior chords
that connect regions with coloring to denote connectivity strength.  The second
is a matrix diagram that supports richer interaction, including querying
individual values, adjusting colormaps, and including several
parameters-of-interest. The `chord` diagram is ideal for sparse graphs, while
the `matrix` is more useful for denser graphs.

The code only requires a web-server, and you can find live examples running
here:
* [http://cabeen.io/brain-matvis-d3/chord/](http://cabeen.io/brain-matvis-d3/chord/)
* [http://cabeen.io/brain-matvis-d3/matrix/](http://cabeen.io/brain-matvis-d3/matrix/)

The provided diagrams present data from a diffusion MRI study of normal aging
adults.  You can learn more about the data from the [repository
website](http://cs.brown.edu/research/mri/mri_repository.html) and you can
request access through [GAAIN](https://www.gaaindata.org/partners/online.html)
at the corresponding [GAAIN partners
page](https://www.gaaindata.org/partner/BEDM).

If you find this useful in your research, we kindly ask that you cite the following abstract, which you can find included in the `media` directory:

`Cabeen, R.P., Bastin, M.E. and Laidlaw, D.H., 2013. A diffusion MRI resource
of 80 age-varied subjects with neuropsychological and demographic measures. In
ISMRM, 21st Scientific Meeting and Exhibition (No. 2138).`

```
@inproceedings{cabeen2013diffusion,
  title={A diffusion MRI resource of 80 age-varied subjects with neuropsychological and demographic measures},
  author={Cabeen, Ryan P and Bastin, ME and Laidlaw, DH},
  booktitle={ISMRM, 21st Scientific Meeting and Exhibition},
  number={2138},
  year={2013}
}
```

## Acknowledgements

Author: Ryan Cabeen, cabeen@gmail.com

Data collection and analysis for this project was supported by NIH grant number
R01 EB004155. The dissemintation of this work is supported by the CZI Imaging
Scientist Award Program, under grant number 2020-225670 from the Chan
Zuckerberg Initiative DAF, an advised fund of Silicon Valley Community
Foundation.
