"""One-time, reviewable import from the company-owned website. No database writes.
Requires requests and Pillow. Source snapshots are cached in artifacts/source.
"""
import json, io, sys
from pathlib import Path
import requests
from PIL import Image

sys.stdout.reconfigure(encoding='utf-8')
root=Path(__file__).resolve().parents[1]
out=root/'public/images/official';out.mkdir(parents=True,exist_ok=True)
data_dir=root/'src/features/catalog';data_dir.mkdir(parents=True,exist_ok=True)
snap=root/'artifacts/source';snap.mkdir(parents=True,exist_ok=True)
for kind in ['product','posts','pages']:
    snapshot=snap/f'{kind}.json'
    if not snapshot.exists():
        response=requests.get(f'https://candientuquochung.com/wp-json/wp/v2/{kind}?per_page=100',timeout=40);response.raise_for_status()
        snapshot.write_text(json.dumps(response.json(),ensure_ascii=False),encoding='utf-8')
sources={kind:json.loads((snap/f'{kind}.json').read_text(encoding='utf-8')) for kind in ['product','posts','pages']}
ledger=[]
def record(kind,id):return next(x for x in sources[kind] if x['id']==id)
def photo(url,name,width=1600):
    target=out/f'{name}.webp'
    if not target.exists():
        response=requests.get(url,timeout=40);response.raise_for_status()
        im=Image.open(io.BytesIO(response.content));im.thumbnail((width,width));im.convert('RGB').save(target,'WEBP',quality=84)
    ledger.append({'file':f'/images/official/{name}.webp','source_image':url})
    return f'/images/official/{name}.webp'
def media(id,name):
    r=requests.get(f'https://candientuquochung.com/wp-json/wp/v2/media/{id}',timeout=30);r.raise_for_status()
    return photo(r.json()['source_url'],name,1200)

# Specs below were manually checked against each source page. Unknown fields stay empty.
definitions=[
('product',3530,'can-xe-tai-3m-12m','Cân xe tải 3 m × 12 m','can-xe-tai','', 'PROJECT','', [('Kích thước bàn cân','3 m × 12 m')], 'Bàn cân xe tải kích thước 3 m × 12 m. Cấu hình tải trọng, cảm biến và phương án lắp đặt được lựa chọn theo mặt bằng và nhu cầu vận hành.', 'Trạm cân, kho hàng, điểm thu mua', ''),
('product',3534,'can-xe-tai-3m-8m','Cân xe tải 3 m × 8 m','can-xe-tai','', 'PROJECT','', [('Kích thước bàn cân','3 m × 8 m')], 'Giải pháp bàn cân xe tải 3 m × 8 m trong danh mục Quốc Hưng. Trao đổi loại xe, tải trọng dự kiến và mặt bằng để xác định cấu hình.', 'Trạm cân, điểm thu mua', ''),
('product',429,'can-ban-vdi02-kubota','Cân bàn VDI02 Kubota MasterScale','can-ban','VDI02','QUOTE','60–500 kg', [('Các mức cân','60 / 150 / 300 / 500 kg'),('Kích thước bàn cân','380 × 480 / 460 × 600 / 500 × 700 mm'),('Bộ chỉ thị','VDI02 Kubota MasterScale'),('Cảm biến lực','Mavin'),('Giao tiếp','RS232'),('Khung / mặt cân','Thép sơn tĩnh điện / inox'),('Nguồn điện','AC 220V, 50/60Hz hoặc ắc quy khô')], 'Dòng cân bàn kết hợp đầu chỉ thị VDI02 Kubota MasterScale và cảm biến Mavin. Có nhiều lựa chọn tải trọng, kích thước; các mức cấu hình không dùng đồng thời trên một thiết bị.', 'Kho hàng, xưởng sản xuất, thu mua nông sản',''),
('product',3613,'can-san-5-tan','Cân sàn 5 tấn','can-ban-lon','','QUOTE','5 tấn',[('Mức cân của sản phẩm','5 tấn'),('Bộ chỉ thị','VDI01 Premium – VPTSensor'),('Cảm biến lực','Amcells / Mavin theo cấu hình'),('Giao tiếp','RS232'),('Hoàn thiện','Sơn Epoxy'),('Nguồn điện','AC 220V, 50/60Hz hoặc ắc quy khô')], 'Cân sàn dành cho hàng hóa có khối lượng lớn, sử dụng đầu chỉ thị VDI01 Premium. Kích thước bàn cân và độ chia cần được xác nhận cho cấu hình 5 tấn khi báo giá.', 'Kho hàng, nhà máy, hàng hóa công nghiệp',''),
('product',1474,'can-heo-2-tan','Cân heo điện tử 2 tấn','can-dong-vat','','QUOTE','2 tấn',[('Mức cân','2 tấn'),('Bàn cân','Tôn gân, sơn Epoxy'),('Lồng cân','Sắt hộp và ống tròn mạ kẽm'),('Chiều cao lồng tiêu chuẩn','80 cm'),('Hiển thị','LED xanh / đỏ theo cấu hình'),('Nguồn điện','AC 110V/220V hoặc ắc quy 6V/4Ah')], 'Cân động vật có bàn tôn gân và lồng bảo vệ. Cấu hình phù hợp cho việc cân heo trong quy trình chăn nuôi và giao nhận; kích thước lồng được xác nhận theo nhu cầu.', 'Chăn nuôi, cân động vật','12 tháng theo thông tin sản phẩm công bố'),
('product',583,'lit-dong-tieu','Lít đong tiêu inox','dung-cu-nong-san','','QUOTE','',[('Chất liệu','Inox'),('Xuất xứ','Việt Nam'),('Công dụng','Đong thể tích hồ tiêu để kết hợp cân khối lượng')], 'Dụng cụ inox dùng trong đánh giá hồ tiêu theo khối lượng trên một đơn vị thể tích. Phù hợp với điểm thu mua và phân loại nông sản.', 'Thu mua, phân loại hồ tiêu',''),
('posts',4976,'loadcell-curiotec-csba','Loadcell S-Type Curiotec CSBA','cam-bien-khoi-luong','CSBA','QUOTE','10 kg–5 tấn',[('Dạng cảm biến','S-Type, kéo và nén'),('Cấp bảo vệ','IP66'),('Các mức tải','10 / 20 / 50 / 100 / 200 / 500 kg; 1 / 2 / 3 / 5 tf'),('Vật liệu','Nhôm anod cho 10–20 kgf; thép mạ niken cho 50 kgf–5 tf'),('Cáp tín hiệu','4 lõi, vỏ PVC, dài 5 m'),('Điện áp kích thích khuyến nghị','10 V'),('Sai số kết hợp','0,03% RO')], 'Cảm biến lực chữ S của Curiotec, sử dụng cho cả lực kéo và lực nén. Dải tải trọng và vật liệu thay đổi theo phiên bản, cần chọn đúng cấu hình cho hệ thống.', 'Cân treo, cân bồn, cân phễu, máy đóng bao',''),
('posts',4875,'dau-chi-thi-cti-1000','Đầu chỉ thị cân CTI-1000','bo-chi-thi','CTI-1000','QUOTE','',[('Kiểu lắp đặt','Panel Mount'),('Giao tiếp tiêu chuẩn','RS-232'),('Tùy chọn','RS-485, Relay, Analog 0–10V / 4–20mA'),('Tốc độ chuyển đổi A/D','20 lần/giây'),('Kích thước','96 × 48 × 112 mm'),('Kích thước lỗ panel','92 × 45 mm'),('Nguồn cấp','AC 110/220V, 50/60Hz')], 'Đầu chỉ thị CTI-1000 của CURIOSITY TECHNOLOGY, sản xuất bởi CURIOTEC CO., LTD. Thiết kế lắp tủ điều khiển, hỗ trợ RS-232 và các tùy chọn tín hiệu cho hệ thống cân công nghiệp.', 'Tủ điều khiển, hệ thống cân công nghiệp',''),
('product',3608,'can-tinh-tien-ute-30kg','Cân tính tiền UTE 30 kg','can-ky-thuat','UTE','QUOTE','30 kg',[('Mức cân tối đa','30 kg'),('Độ chia','5 g'),('Mức cân tối thiểu','10 g'),('Kích thước mặt cân','27 × 19 cm'),('Màn hình','LED đỏ trước và sau'),('Chức năng','Trừ bì, tính tiền, cộng dồn')], 'Cân tính tiền UTE có màn hình trước và sau, hỗ trợ trừ bì và cộng dồn. Dùng cho cân hàng hóa bán lẻ; cần tránh nước tiếp xúc bo mạch và bộ phận điện tử.', 'Cửa hàng, quầy hàng, bán lẻ','1 năm theo thông tin sản phẩm công bố'),
('product',3647,'qua-can-gang-20kg','Quả cân gang 20 kg','phu-kien','','QUOTE','20 kg',[('Khối lượng danh định','20 kg'),('Vật liệu','Gang đúc'),('Bề mặt','Sơn bảo vệ'),('Ứng dụng','Kiểm tra, đối chiếu và hiệu chuẩn cân')], 'Quả cân gang có bề mặt sơn bảo vệ, dùng trong kiểm tra và bảo trì thiết bị cân. Cấp chính xác và hồ sơ đi kèm cần xác nhận trước khi đặt hàng.', 'Kiểm tra cân bàn, cân sàn, cân công nghiệp',''),
]
products=[]
for kind,id,slug,name,category,model,sales,capacity,specs,desc,application,warranty in definitions:
    source=record(kind,id);image=media(source['featured_media'],slug)
    gallery=[image]
    if id==4875:gallery.append(photo('https://candientuquochung.com/wp-content/uploads/2026/08/CTI1000.jpg','cti-1000-dimensions',1200))
    products.append(dict(source_url=source['link'],source_id=id,slug=slug,name=name,category_slug=category,model=model,sales_type=sales,capacity=capacity,specs=[dict(label=k,value=v) for k,v in specs],short_description=desc,full_description=f'## Tổng quan\n{desc}\n\n## Lựa chọn cấu hình\nTrao đổi với Quốc Hưng về vật cần cân, môi trường sử dụng và yêu cầu kết nối. Các lựa chọn thiết bị được xác nhận trong báo giá trước khi đặt hàng.',application=application,warranty=warranty,featured_image=image,gallery=gallery,brand='Curiotec' if id==4976 else 'CURIOSITY TECHNOLOGY' if id==4875 else '',division='5 g' if id==3608 else '',price=None))
    print('Prepared',name)

projects=[]
for id,slug,title,location,description,images in [
 (5013,'tram-can-80-tan-ea-sup','Trạm cân 80 tấn tại Ea Súp','Ea Súp, Đắk Lắk','Trạm cân 3 m × 12 m phục vụ thu mua, vận chuyển và kiểm soát hàng hóa. Quốc Hưng đã hoàn thành lắp đặt và đưa hệ thống vào vận hành.',['2026/09/12m-noi.jpg','2026/09/12m-noi-23.jpg','2026/09/12m-noi-2.jpg']),
 (4998,'tram-can-60-tan-dam-rong','Trạm cân 60 tấn tại Đam Rông','Đam Rông, Lâm Đồng','Bàn cân thép 3 m × 8 m, tải trọng 60 tấn. Công trình đã được thi công, hiệu chỉnh và bàn giao phục vụ kiểm soát khối lượng hàng hóa.',['2026/09/8m-noi-2.jpg','2026/09/8m-noi-3.jpg','2026/09/8m-noi-4.jpg']),
 (4937,'tram-can-khanh-vinh','Bàn giao trạm cân tại Khánh Vĩnh','Khánh Vĩnh, Khánh Hòa','Trạm cân ô tô 3 m × 6 m phục vụ cân xe và kiểm soát hàng hóa. Hệ thống được lắp đặt, kiểm tra và hiệu chỉnh trước khi bàn giao.',['2026/08/288.jpg','2026/08/288-.jpg','2026/08/288-2.jpg'])]:
    source=record('posts',id);gallery=[photo('https://candientuquochung.com/wp-content/uploads/'+url,f'{slug}-{i}') for i,url in enumerate(images)]
    projects.append(dict(source_url=source['link'],source_id=id,slug=slug,title=title,location=location,industry='Trạm cân xe tải',excerpt=description,content=f'## Bài toán vận hành\n{description}\n\n## Hạng mục triển khai\nLắp đặt hệ thống cân, kiểm tra và hiệu chỉnh trước khi bàn giao.\n\n## Kết quả công bố\nCông trình đã được Quốc Hưng bàn giao. Thông tin khách hàng, ngày nghiệm thu và số liệu hiệu quả vận hành chưa được công bố trong hồ sơ nguồn.',featured_image=gallery[0],gallery=gallery,source_date=source['date'],result='Đã bàn giao theo thông tin công bố của Quốc Hưng.',requirement='Cân xe và kiểm soát khối lượng hàng hóa.',solution=description))
assets={'hero':projects[0]['featured_image'],'team':photo('https://candientuquochung.com/wp-content/uploads/2025/08/NV-KD.jpg','quoc-hung-team'),'automation':photo('https://candientuquochung.com/wp-content/uploads/2026/09/QHS3.jpg','tram-can-tu-dong'),'software':photo('https://candientuquochung.com/wp-content/uploads/2026/09/qhs2.jpg','phan-mem-can')}
(data_dir/'official.json').write_text(json.dumps(dict(products=products,projects=projects,assets=assets),ensure_ascii=False,indent=2),encoding='utf8')
docs=root/'docs';docs.mkdir(exist_ok=True)
(docs/'media-provenance.json').write_text(json.dumps(ledger,ensure_ascii=False,indent=2),encoding='utf8')
logo=Image.open('D:/QHS/Design/Logo/Logo.png');logo.thumbnail((1000,400));logo.save(out/'logo.webp','WEBP',quality=95)
print('Prepared assets and content. No database changes.')
