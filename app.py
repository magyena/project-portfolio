from datetime import datetime
import uuid
from flask import Flask, redirect, render_template, jsonify, request
import psycopg2
import os
import supabase
from werkzeug.utils import secure_filename

app = Flask(__name__)
UPLOAD_FOLDER = "static/uploads"
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

hostname = "aws-0-ap-southeast-1.pooler.supabase.com"
database = "postgres"
port = "6543"
username = "postgres.wznglqsbzzejpfwhesmw"
password = "M@langPost11"
SUPABASE_URL = "https://wznglqsbzzejpfwhesmw.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6bmdscXNienplanBmd2hlc213Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMDE5MDM3NCwiZXhwIjoyMDQ1NzY2Mzc0fQ.WpVubAEG_EQRxuVFp33IlKWtZUDFFIq6tpUliNolG6g"

supabase = supabase.create_client(SUPABASE_URL, SUPABASE_KEY)


def get_db_connection():
    conn = psycopg2.connect(
        database=database, user=username, password=password, host=hostname, port=port
    )
    return conn


@app.route("/projects", methods=["GET"])
def get_projects():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM projects ORDER BY id DESC")
    rows = cur.fetchall()
    column_names = [desc[0] for desc in cur.description]
    result = [dict(zip(column_names, row)) for row in rows]
    cur.close()
    conn.close()
    return jsonify(result)


@app.route("/")
def index():
    # Ambil data dari PostgreSQL
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM projects ORDER BY progress ASC")
    project_rows = cur.fetchall()
    project_cols = [desc[0] for desc in cur.description]
    projects = [dict(zip(project_cols, row)) for row in project_rows]
    cur.close()
    conn.close()

    response = (
        supabase.table("blog_posts")
        .select("*")
        .order("id", desc=True)
        .limit(5)
        .execute()
    )
    blogs = response.data
    for blog in blogs:
        if isinstance(blog.get("created_at"), str):
            blog["created_at"] = datetime.fromisoformat(blog["created_at"])
    return render_template("index.html", projects=projects, blogs=blogs)


@app.route("/detail")
def detail():
    return render_template("detail.html")


@app.route("/add", methods=["GET", "POST"])
def add():
    if request.method == "POST":
        title = request.form["title"]
        short_description = request.form["short_description"]
        full_description = request.form["full_description"]
        technologies = request.form["technologies"]
        github_link = request.form["github_link"]
        live_demo_link = request.form["live_demo_link"]
        is_featured = request.form.get("is_featured") == "on"

        # ✅ Tambahan baru
        progress = int(request.form.get("progress", 0))  # Default ke 0 kalau kosong
        jobdesk = request.form.get("jobdesk", "").strip()

        # Gambar utama
        file = request.files["image"]
        if file and file.filename != "":
            filename = secure_filename(file.filename)
            image_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)
            file.save(image_path)
        else:
            filename = "default.png"

        # Gambar detail aplikasi
        detail_file = request.files.get("detail_image")
        if detail_file and detail_file.filename != "":
            detail_filename = secure_filename(detail_file.filename)
            detail_image_path = os.path.join(
                app.config["UPLOAD_FOLDER"], detail_filename
            )
            detail_file.save(detail_image_path)
        else:
            detail_filename = None  # atau default jika ada

        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute(
            """
            INSERT INTO projects (
                title, image, detail_image, short_description, 
                full_description, technologies, github_link, 
                live_demo_link, is_featured, progress, jobdesk
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """,
            (
                title,
                filename,
                detail_filename,
                short_description,
                full_description,
                technologies,
                github_link,
                live_demo_link,
                is_featured,
                progress,
                jobdesk,
            ),
        )
        conn.commit()
        cur.close()
        conn.close()
        return redirect("/cms")
    return render_template("add_fragment.html")


@app.route("/cms")
def cms():
    return render_template("cms.html")


@app.route("/add-fragment")
def add_fragment():
    return render_template("add_fragment.html")


@app.route("/add-blog-fragment", methods=["GET", "POST"])
def add_blog_fragment():
    if request.method == "POST":
        title = request.form["title"]
        author = request.form["author"]
        description = request.form["description"]
        image = request.files["image"]

        image_url = None

        if image:
            filename = f"{uuid.uuid4()}_{secure_filename(image.filename)}"
            file_bytes = image.read()

            upload_response = supabase.storage.from_("gambar").upload(
                path=f"uploads/{filename}",
                file=file_bytes,
                file_options={"content-type": image.mimetype},
            )

            if upload_response:
                image_url = supabase.storage.from_("gambar").get_public_url(
                    f"uploads/{filename}"
                )

                supabase.table("blog_posts").insert(
                    {
                        "title": title,
                        "author": author,
                        "description": description,
                        "image_url": image_url,
                    }
                ).execute()

                return redirect("/cms")

    return render_template("add_blog.html")


if __name__ == "__main__":
    app.run(debug=False)

# if __name__ == "__main__":
#     app.run(host="0.0.0.0", port=5000, debug=True)
