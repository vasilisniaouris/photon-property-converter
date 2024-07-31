import os

import numpy as np
import matplotlib as mpl
from matplotlib import pyplot as plt
from PIL import Image
from scipy.special import erfc

# Parameters
mu = 0.0  # Mean of the Gaussian
sigma = 0.4  # Standard deviation of the Gaussian
lam = 0.5  # Rate parameter of the exponential (lambda) # 0.9
t = np.linspace(-3, 8, 1000)  # Time array
frequency = 0.4  # Frequency of the sinusoidal function # 0.9


# Convolution of Gaussian and Exponential
def exp_gauss_convolution(t, mu, sigma, lam):
    return (lam / 2) * np.exp((lam / 2) * (2 * mu + lam * sigma ** 2 - 2 * t)) * erfc(
        (mu + lam * sigma ** 2 - t) / (np.sqrt(2) * sigma))


# Compute the envelope
envelope = exp_gauss_convolution(t, mu, sigma, lam)

# Sinusoidal function
sinusoidal = np.sin(2 * np.pi * frequency * t)

# Multiply the sinusoidal function by the envelope
enveloped_signal = sinusoidal * envelope

# Create a color gradient
norm = plt.Normalize(-1, t.max() * 0.8)
colormap = mpl.colormaps['rainbow']
colors = colormap(norm(t))

# Plotting
fig, ax = plt.subplots(figsize=(1.5, 1.5))

# Add a background circle
radius = 0.4
circle = plt.Circle((0.5, 0.5), radius, color='black', transform=ax.transAxes, zorder=0)
ax.add_artist(circle)

# Add an arrow on the left side
ax.plot([t[0]+0.2], [0], color=colors[0], linewidth=0, marker='<', markersize=15)
ax.plot([t[0]-0.5], [0], color=colors[0], markersize=0.0)

# Plot the envelope and the enveloped signal with colormap
amp_for_line_width = 0.01
for i in range(len(t) - 1):
    ax.fill_between(t[i:i + 2], -envelope[i:i + 2]*1.1 - amp_for_line_width, envelope[i:i + 2]*1.1 + amp_for_line_width,
                    color=colors[i], alpha=0.045)
    ax.plot(t[i:i + 2], enveloped_signal[i:i + 2], color=colors[i], linewidth=4)

# Remove everything that makes this look like a plot
ax.set_xticks([])
ax.set_yticks([])
ax.spines['top'].set_visible(False)
ax.spines['right'].set_visible(False)
ax.spines['bottom'].set_visible(False)
ax.spines['left'].set_visible(False)

# Save the plot as a PNG and SVG file
logo_path = 'logo'
logo_png_path = f'{logo_path}.png'
logo_svg_path = f'{logo_path}.svg'
logo_ico_path = f'{logo_path}.ico'
plt.tight_layout(pad=0)
plt.savefig(logo_png_path, bbox_inches='tight', pad_inches=0, transparent=True, dpi=600)
plt.savefig(logo_svg_path, bbox_inches='tight', pad_inches=0, transparent=True, format='svg')
plt.close()

# Convert the PNG file to ICO format
img = Image.open(logo_png_path)
img.save(logo_ico_path, format='ICO', sizes=[(256, 256)])
img.close()

if os.path.exists(logo_png_path):
    os.remove(logo_png_path)
    print(f"{logo_png_path} has been deleted.")
else:
    print(f"{logo_png_path} does not exist.")